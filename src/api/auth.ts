import { functions, app, auth } from "../config";

import { httpsCallable } from "firebase/functions";
import { type AuthError } from '@firebase/auth';
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  sendPasswordResetEmail,
  UserCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import React, { useState } from "react";
import style from "../app/page.module.css";
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
  return new Promise(async (resolve, reject) => {
    
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user)
        monitorAuthState();
        resolve(userCredential);
      })
      .catch((error: AuthError) => {
        reject(error);
      });
  });
}

export const monitorAuthState = async () => {
  await onAuthStateChanged(auth, user => {
    if (user) {
      console.log(user)
      console.log("logged in! switch to user dashboard page")
      
    } else {
      console.log("you are not logged in")
    }
  });
}




export function logOut(): Promise<void> {
  return new Promise(async (resolve, reject) => {
  await signOut(auth)
      .then(() => {
        console.log("logged out!")
        monitorAuthState();

        resolve();
      
      })
      .catch((error) => {
        reject(error);
      });
  });
}





// const submitting = async (email: string, password: string) => {
//   console.log('email:', email);
//     try {
//       const userCred: UserCredential = await signInWithEmailAndPassword(auth, email, password);
//       console.log(userCred.user);
//     } catch (error) {
//       console.error('Error signing in:', error);
//     }

// };

// export default submitting;