import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();
connectAuthEmulator(auth, "http://127.0.0.1:9099");
connectFirestoreEmulator(db, "127.0.0.1", 8080);
