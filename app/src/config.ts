// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

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
  measurementId: "G-FKWPZG3GKD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-east4");
export default app;
