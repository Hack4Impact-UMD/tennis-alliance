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
                email: user.data.email,
                password: user.data.password,
            });

            res.json({ result: user });
        });
    });

exports.createEvent = functions
    .region("us-east4")
    .https.onRequest((req, res) => {
        corsHandler(req, res, async () => {
            const event = req.body;

            // TODO: Validate event data

            await db.collection("events").add(event);
            res.json({ result: event });
        });
    });

exports.updateEvent = functions
    .region("us-east4")
    .https.onRequest((req, res) => {
        corsHandler(req, res, async () => {
            try {
                const { id, data } = req.body;
                const eventRef = db.collection("events").doc(id);
                const eventDoc = await eventRef.get();

                if (!eventDoc.exists) {
                    res.status(404).json({ error: "Event not found." });
                    return;
                }

                await eventRef.update(data);
                res.json({ result: "Event updated successfully." });
            } catch (error) {
                console.error("Error updating event:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    });

exports.deleteEvent = functions
    .region("us-east4")
    .https.onRequest((req, res) => {
        corsHandler(req, res, async () => {
            try {
                const { id } = req.body;
                const eventRef = db.collection("events").doc(id);
                const eventDoc = await eventRef.get();

                if (!eventDoc.exists) {
                    res.status(404).json({ error: "Event not found." });
                    return;
                }

                await eventRef.delete();
                res.json({ result: "Event deleted successfully." });
            } catch (error) {
                console.error("Error deleting event:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    });

exports.getEvents = functions.region("us-east4").https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            const eventsSnapshot = await db.collection("events").get();
            const eventsData = [];

            eventsSnapshot.forEach((doc) => {
                eventsData.push(doc.data());
            });

            res.json({ data: eventsData });
        } catch (error) {
            console.error("Error retrieving events:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});
