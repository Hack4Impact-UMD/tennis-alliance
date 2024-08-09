import {
    signInWithEmailAndPassword,
    // getAuth,
    signOut,
    // sendPasswordResetEmail,
    UserCredential,
    onAuthStateChanged,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { type AuthError } from "@firebase/auth";
import { functions, auth } from "@/config";
import { type User } from "@/types";

// Create user and logs them in
export function createUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
        const createUserCloudFunction = httpsCallable(functions, "createUser");
        createUserCloudFunction(user)
            .then(() => {
                console.log(user);
                // Logs user after creating account
                authenticateUser(user.email, user.password);
                resolve();
            })
            .catch((error: string) => {
                console.log(user);
                reject(error);
            });
    });
}

// Log in
export function authenticateUser(
    email: string,
    password: string
): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential.user);
                monitorAuthState();
                resolve(userCredential);
            })
            .catch((error: AuthError) => {
                reject(error);
            });
    });
}

export const monitorAuthState = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Needs to implement transition to user dashboard IF Just logged in
            // I think it shouldn't do anything if already logged in
            console.log(user);
            console.log("logged in! switch to user dashboard page");
        } else {
            // If not logged in, current page should be the login page
            console.log("you are not logged in");
        }
    });
};

// Log out
export function logOut(): Promise<void> {
    return new Promise((resolve, reject) => {
        signOut(auth)
            .then(() => {
                console.log("logged out!");
                monitorAuthState();
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}
