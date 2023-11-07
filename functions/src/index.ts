/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


export const functions = require("firebase-functions");
const admin = require("firebase-admin");
export const app = admin.initializeApp();
const db = admin.firestore();
const cors = require("cors");
const corsHandler = cors({ origin: true });

/*
 * Creates a new user
 *
 * Arguments: id: number,
              email: string,
              pass: Hash,
              firstName: string,
              lastName: string,
              phone: number,
              zip: number,
              children: {
                firstName: string,
                lastName: string,
                age: number,
                birthYear: number,
                school: string,
              }[],
              notifs: boolean,
 */

exports.createUser = functions
  .region("us-east4")
  .https.onRequest((req: any, res: any) => {
    corsHandler(req, res, async () => {
      const auth = admin.auth();
      await auth
        .verifyIdToken(req.headers.authorization.split("Bearer ")[1])
        .then(async (decodedToken: any) => {
          if (
            req.body.data.id == null ||
            req.body.data.email == null ||
            req.body.data.pass == null ||
            req.body.data.firstName == null ||
            req.body.data.lastName == null ||
            req.body.data.phone == null ||
            req.body.data.zip == null ||
            req.body.data.children == null ||
            req.body.data.children.firstName == null ||
            req.body.data.children.lastName == null ||
            req.body.data.children.age == null ||
            req.body.data.children.birthYear == null ||
            req.body.data.children.school == null ||
            req.body.data.notifs == null
          ) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "Missing arguments. Request must include email, name, and role."
            );
          } else if (decodedToken.role.toLowerCase() != "admin") {
            throw new functions.https.HttpsError(
              "permission-denied",
              "Only an admin user can create users"
            );
          } else {
            await auth
              .createUser({
                email: req.body.data.email,
                password: "defaultpassword",
              })
              .then(async (userRecord: any) => {
                await auth
                  .then(async () => {
                    await db
                      .collection("Users")
                      .add({
                        auth_id: userRecord.uid,
                        email: req.body.data.email,
                        pass: req.body.password, 
                        firstName: req.body.newFirstName, 
                        lastName: req.body.newLastName, 
                        phone: req.body.phoneNumber, 
                        zip: req.body.zipCode,  
                        children: req.body.children, 
                        notifs: req.body.notifcations
                      })
                      .then(() => {
                        res.json({ result: "Complete" });
                      })
                      .catch((error: any) => {
                        throw new functions.https.HttpsError(
                          "Unknown",
                          "Failed to add user to database"
                        );
                      });
                  });
              })
              .catch((error: any) => {
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Failed to add user to authorization"
                );
              });
          }
        })
        .catch((error: any) => {
          throw new functions.https.HttpsError(
            "unauthenticated",
            "failed to authenticate request. ID token is missing or invalid."
          );
        });
    });
  });

