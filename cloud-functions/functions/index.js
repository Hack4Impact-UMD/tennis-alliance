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
const configuredEmail = process.env.EMAIL_USER || emailToUse;

const createTransporter = () => {
  if (
    !configuredEmail ||
    !process.env.OAUTH_CLIENT_ID ||
    !process.env.OAUTH_CLIENT_SECRET ||
    !process.env.OAUTH_REFRESH
  ) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: configuredEmail,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

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

exports.createFamilyUser = onCall(
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

          const familyData = {
            email: data.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phone: data.user.phone,
            zip: data.user.zip,
            notifications: data.user.notifications,
            waiver: data.user.waiver,
            children: Array.isArray(data.user.children) ? data.user.children : [],
            type: data.user.type,
            altName: data.user.altName || "",
            altEmail: data.user.altEmail || "",
            events: [],
            createdAt: new Date(),
            auth_id: userRecord.uid,
          };

          await db.collection("Users").doc(userRecord.uid).set(familyData);
          resolve();
          return;
        }

        reject(new Error("Invalid family user payload"));
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
);

exports.sendEmail = onCall(
  {
    region: "us-east4",
    cors: true,
    secrets: [
      "EMAIL_USER",
      "OAUTH_CLIENT_ID",
      "OAUTH_CLIENT_SECRET",
      "OAUTH_REFRESH",
    ],
  },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          data.bcc == null ||
          data.text == null ||
          !auth ||
          !auth.token ||
          auth.token.role.toLowerCase() != "admin"
        ) {
          reject(new Error("Invalid email request"));
          return;
        }

        const transporter = createTransporter();
        if (!transporter || !configuredEmail) {
          reject(new Error("Email transporter is not configured"));
          return;
        }

        const msg = {
          from: configuredEmail,
          to: configuredEmail,
          subject: `Tennis Alliance ${data.reason}`,
          bcc: data.bcc,
          html: `
              <div>
                  <div style="max-width: 600px; margin: auto">
                      <br><br><br>
                      <p style="font-size: 16px">
                      Hello,<br>
                      <br>
                      ${data.text}
                      <br>
                  <div>
              </div>
              `,
        };

        await transporter.sendMail(msg);
        resolve({ sent: true });
      } catch (error) {
        console.error("Failed to send email:", error);
        reject(error);
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
          const eventIds = new Set();
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userEvents = Array.isArray(userData.events) ? userData.events : [];
            userEvents.forEach((event) => {
              if (event && event.id) {
                eventIds.add(event.id);
              }
            });
            promises.push(doc.ref.update({ email: data.newEmail }));
          });

          eventIds.forEach((eventId) => {
            const eventRef = db.collection("Events").doc(eventId);
            promises.push(
              eventRef.get().then(async (eventSnapshot) => {
                if (!eventSnapshot.exists) {
                  return;
                }

                const eventData = eventSnapshot.data();
                const participants = Array.isArray(eventData.participants)
                  ? eventData.participants
                  : [];
                const updatedParticipants = participants.map((participant) => {
                  if (participant.mainId === auth.uid) {
                    return {
                      ...participant,
                      email: data.newEmail,
                    };
                  }
                  return participant;
                });

                return eventRef.update({ participants: updatedParticipants });
              })
            );
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
                eventData.participants = Array.isArray(eventData.participants)
                  ? eventData.participants
                  : [];
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
                    eventData.participants[index] = participant;
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
        } else {
          console.log("Failed prior checks");
          reject();
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
          const userRef = db.collection("Users").doc(data.auth_id);
          const selectedRole =
            data.role === "volunteer" ? "volunteer" : data.role === "participant" ? "participant" : null;

          if (!selectedRole || !Array.isArray(data.members) || data.members.length === 0) {
            reject(new Error("Invalid registration payload"));
            return;
          }

          await db.runTransaction(async (transaction) => {
            const [eventSnapshot, userSnapshot] = await Promise.all([
              transaction.get(eventRef),
              transaction.get(userRef),
            ]);

            if (!eventSnapshot.exists || !userSnapshot.exists) {
              throw new functions.https.HttpsError(
                "not-found",
                "Event or user record not found"
              );
            }

            const event = eventSnapshot.data();
            const user = userSnapshot.data();
            const userEvents = Array.isArray(user.events) ? user.events : [];
            const eventParticipants = Array.isArray(event.participants)
              ? event.participants
              : [];

            const isUserAlreadyRegistered = userEvents.some(
              (registeredEvent) => registeredEvent.id == data.eventId
            );
            const isEventAlreadyRegistered = eventParticipants.some(
              (participant) => participant.mainId == data.auth_id
            );

            if (isUserAlreadyRegistered || isEventAlreadyRegistered) {
              throw new functions.https.HttpsError(
                "already-exists",
                "User already registered for this event"
              );
            }

            const requestedCount = data.members.length;
            const roleKey =
              selectedRole === "participant" ? "maxParticipants" : "maxVolunteers";
            const roleCapacity = Number(event[roleKey]);
            const currentRoleCount = eventParticipants.reduce((total, participant) => {
              if (participant.role !== selectedRole) {
                return total;
              }

              const memberCount = Array.isArray(participant.otherMembers)
                ? participant.otherMembers.length
                : 0;
              return total + memberCount;
            }, 0);

            if (!Number.isFinite(roleCapacity) || roleCapacity < currentRoleCount + requestedCount) {
              throw new functions.https.HttpsError(
                "failed-precondition",
                `${selectedRole} capacity is full`
              );
            }

            transaction.update(userRef, {
              events: [
                ...userEvents,
                {
                  id: data.eventId,
                  participants: data.members,
                  role: selectedRole,
                },
              ],
            });

            transaction.update(eventRef, {
              participants: [
                ...eventParticipants,
                {
                  email: user.email,
                  mainId: user.auth_id,
                  mainFirstName: user.firstName,
                  mainLastName: user.lastName,
                  otherMembers: data.members,
                  role: selectedRole,
                },
              ],
            });
          });
          resolve();
        }
      } catch (error) {
        console.log(error);
        reject(error);
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
          const eventSnapshot = await eventRef.get();
          const userRef = db.collection("Users").doc(data.auth_id);
          const userSnapshot = await userRef.get();

          if (!eventSnapshot.exists || !userSnapshot.exists) {
            reject();
            return;
          }

          const event = eventSnapshot.data();
          const user = userSnapshot.data();
          const userEvents = Array.isArray(user.events) ? user.events : [];
          const eventParticipants = Array.isArray(event.participants)
            ? event.participants
            : [];

          const updatedUserEvents = userEvents.filter(
            (event) => event.id != data.eventId
          );
          const updatedEventParticipants = eventParticipants.filter(
            (participant) => participant.mainId != data.auth_id
          );
          const batch = db.batch();
          batch.update(eventRef, { participants: updatedEventParticipants });
          batch.update(userRef, { events: updatedUserEvents });
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
