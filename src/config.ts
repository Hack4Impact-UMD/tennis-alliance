import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDd0SAfQhm-LBDi3Obejkf9yxhnYEtRloE",
    authDomain: "tennis-alliance.firebaseapp.com",
    projectId: "tennis-alliance",
    storageBucket: "tennis-alliance.appspot.com",
    messagingSenderId: "343999289926",
    appId: "1:343999289926:web:fae3c6f9d9f0afe8bb4847",
    measurementId: "G-FKWPZG3GKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export const auth = getAuth(app);
export const db = getFirestore();
connectAuthEmulator(auth, "http://127.0.0.1:9099");
connectFirestoreEmulator(db, "127.0.0.1", 8080);


