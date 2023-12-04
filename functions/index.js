const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const cors = require("cors");
const corsHandler = cors({ origin: true });

exports.createUser = functions
    .region("us-east4")
    .https.onRequest((req, res) => {
        corsHandler(req, res, async () => {
            const user = req.body;

            console.log("Received user:", user);
            const auth = admin.auth();
            // Add user to database
            await db.collection("users").add(user);

            // Adds user to authetication
            await auth.createUser({
                email: user.data.newEmail,
                password: user.data.password,
            });

            res.json({ result: user });
        });
    });
