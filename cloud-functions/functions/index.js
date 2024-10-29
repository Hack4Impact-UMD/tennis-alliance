const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const functions = require("firebase-functions");
const { onCall, onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { WriteBatch } = require("firebase-admin/firestore");
const { getStorage, getDownloadURL } = require("firebase-admin/storage");
const axios = require("axios");
admin.initializeApp();
const db = admin.firestore();
dotenv.config();
const { onSchedule } = require("firebase-functions/v2/scheduler");

// Once email is obtained, set it up
const emailToUse = "";
// const oauth2Client = new OAuth2(
//   process.env.OAUTH_CLIENT_ID, // ClientID
//   process.env.OAUTH_CLIENT_SECRET, // Client Secret
//   "https://developers.google.com/oauthplayground" // Redirect URL
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.OAUTH_REFRESH,
// });
// const accessToken = oauth2Client.getAccessToken();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: emailToUse,
//     clientId: process.env.OAUTH_CLIENT_ID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.OAUTH_REFRESH,
//     accessToken: accessToken,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

/*
 * Creates a new user.
 * Takes an object as a parameter that should contain an email, name, and a role field.
 * This function can only be called by a user with admin status
 * Arguments: email: string, the user's email
 *            name: string, the user's name
 *            role: string, (Options: "ADMIN", "TEACHER")
 */
exports.createUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const authorization = admin.auth();
        if (data.email != null && data.user != null) {
          const pass = crypto.randomBytes(32).toString("hex");
          const userRecord = await authorization.createUser({
            email: data.email,
            password: pass,
          });
          await authorization.setCustomUserClaims(userRecord.uid, {
            role: "USER",
          });
          const collectionObject = {
            ...data.user,
            auth_id: userRecord.uid,
          };
          await db
            .collection("Users")
            .doc(userRecord.uid)
            .set(collectionObject);

          resolve();
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }
);

exports.sendEmail = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          data.bcc != null &&
          data.text != null &&
          auth &&
          auth.token &&
          auth.token.role.toLowerCase() == "admin"
        ) {
          const msg = {
            from: emailToUse, // sender address
            to: emailToUse, // list of receivers
            subject: `Tennis Alliance ${data.reason}`, // Subject line
            bcc: data.bcc,
            html: `
              <div>
                  <div style="max-width: 600px; margin: auto">
                      <br><br><br>
                      <p style="font-size: 16px">
                      Hello,<br>
                      <br>
                      ${text}
                      <br>
                      
                  <div>
              </div>
                  
              `, // html body
          };
          await transporter.sendMail(msg).catch((error) => {
            console.log(
              "Error occured with new submission. Email also could not be sent."
            );
            console.log(error);
          });
        } else {
          reject();
        }
      } catch (error) {
        reject();
      }
    });
  }
);

/**
 * Updates a user's email
 * Arguments: email - the user's current email
 *            newEmail - the user's new email
 */

exports.updateUserEmail = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const authorization = admin.auth();
        if (
          data.email != null &&
          data.newEmail != null &&
          auth &&
          auth.token &&
          auth.token.email.toLowerCase() == data.email.toLowerCase()
        ) {
          await authorization.updateUser(auth.uid, {
            email: data.newEmail,
          });
          const querySnapshot = await db
            .collection("Users")
            .where("auth_id", "==", auth.uid)
            .get();
          if (querySnapshot.docs.length == 0) {
            reject();
          }
          const promises = [];
          querySnapshot.forEach((doc) => {
            promises.push(doc.ref.update({ email: data.newEmail }));
          });
          await Promise.all(promises);
          resolve();
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }
);

exports.getEvents = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          data.auth_id != null &&
          auth &&
          auth.token &&
          (auth.token.role.toLowerCase() == "user" ||
            auth.token.role.toLowerCase() == "admin")
        ) {
          const priorEvents = [];
          const registeredUpcoming = [];
          const upcomingEvents = [];
          await db
            .collection("Events")
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                const date = new Date();

                // Format the date in yyyy-mm-dd
                const formattedDate = new Intl.DateTimeFormat("en-CA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  timeZone: "America/New_York",
                }).format(date);
                const eventData = { ...doc.data(), id: doc.id };
                const upcoming = eventData.date >= formattedDate;
                if (auth.token.role.toLowerCase() == "admin") {
                  if (upcoming) {
                    upcomingEvents.push(eventData);
                  } else {
                    priorEvents.push(eventData);
                  }
                } else {
                  eventData.participants.forEach((participant, index) => {
                    if (participant.mainId != data.auth_id) {
                      participant.email = "email";
                      participant.mainId = "mainId";
                      participant.otherMembers.forEach((member) => {
                        member.firstName = "firstName";
                        member.lastName = "lastName";
                      });
                    }
                    eventData[index] = participant;
                  });

                  const userInEvent = eventData.participants.find(
                    (participant) => participant.mainId == data.auth_id
                  );
                  if (!upcoming && userInEvent) {
                    priorEvents.push(eventData);
                  } else if (upcoming) {
                    if (userInEvent) {
                      registeredUpcoming.push(eventData);
                    } else {
                      upcomingEvents.push(eventData);
                    }
                  }
                }
              });
            });

          resolve({ priorEvents, registeredUpcoming, upcomingEvents });
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }
);

exports.addUserToEvent = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          data.eventId != null &&
          data.auth_id != null &&
          auth &&
          auth.token &&
          auth.token.role.toLowerCase() == "user"
        ) {
          const eventRef = db.collection("Events").doc(data.eventId);
          const event = await eventRef.get();
          const userRef = db.collection("Users").doc(data.auth_id);
          const user = await userRef.get();
          user.events = user.events.push({
            id: data.eventId,
            participants: data.members,
          });
          event.participants.push({
            email: user.email,
            mainId: user.auth_id,
            mainFirstName: user.firstName,
            mainLastName: user.lastName,
            otherMembers: data.members,
          });
          const batch = db.batch();
          batch.update(eventRef, event);
          batch.update(userRef, user);
          await batch.commit();
          resolve();
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }
);

exports.removeUserFromEvent = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          data.eventId != null &&
          data.auth_id != null &&
          auth &&
          auth.token &&
          auth.token.role.toLowerCase() == "user"
        ) {
          const eventRef = db.collection("Events").doc(data.eventId);
          const event = await eventRef.get();
          const userRef = db.collection("Users").doc(data.auth_id);
          const user = await userRef.get();
          user.events = user.events.filter((event) => event.id != data.eventId);
          event.participants = event.participants.filter(
            (participant) => participant.mainId != data.auth_id
          );
          const batch = db.batch();
          batch.update(eventRef, event);
          batch.update(userRef, user);
          await batch.commit();
          resolve();
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }
);
