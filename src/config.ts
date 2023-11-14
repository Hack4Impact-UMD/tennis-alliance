import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
    projectId: "tennis-alliance",
    apiKey: "fakeApiKey"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const functions = getFunctions(app, "us-east4");
const auth = getAuth();
const db = getFirestore();

connectFunctionsEmulator(functions, "127.0.0.1", 5001);
connectAuthEmulator(auth, "http://127.0.0.1:9099");
connectFirestoreEmulator(db, "127.0.0.1", 8080);

export { functions, auth, db };
