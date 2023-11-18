import { functions, app } from "../config";

import { httpsCallable } from "firebase/functions";
import { type AuthError } from '@firebase/auth';
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  sendPasswordResetEmail,
  UserCredential,
} from 'firebase/auth';

/*
 * Creates a user and sends a password reset email to that user.
 */

type Children = {
    firstName: string;
    lastName: string;
    age: number;
    birthYear: number;
    school: string;
};

type User = {
    uid: number;
    newEmail: string;
    password: string;
    newFirstName: string;
    newLastName: string;
    phoneNumber: number;
    zipCode: number;
    children: Children[];
    notifcations: boolean;
};

export function createUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
        const createUserCloudFunction = httpsCallable(
            functions,
            "createUser"
        );
        createUserCloudFunction(user)
            .then(() => {
                console.log(user);
                resolve();
            })
            .catch((error: string) => {
                console.log(user);
                reject(error);
            });
    });
}



export function authenticateUser(
  email: string,
  password: string,
): Promise<UserCredential> {
  return new Promise((resolve, reject) => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        resolve(userCredential);
      })
      .catch((error: AuthError) => {
        reject(error);
      });
  });
}

export function logOut(): Promise<void> {
  return new Promise((resolve, reject) => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}