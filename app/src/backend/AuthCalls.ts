import { type AuthError, type User } from "@firebase/auth";
import {
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
} from "firebase/auth";
import app from "../config";

export function authenticateUser(
    email: string,
    password: string
): Promise<User> {
    return new Promise((resolve, reject) => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                resolve(userCredential.user);
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

export function sendResetEmail(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const auth = getAuth(app);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/*
Updates the logged-in user's password.
Shouldn't face the re-authentication issue because password is provided to re-authenticate within the function.

 */
export async function updateUserPassword(
    newPassword: string,
    oldPassword: string
): Promise<string> {
    return await new Promise((resolve, reject) => {
        const auth = getAuth(app);
        const user = auth.currentUser;

        if (user != null) {
            const credential = EmailAuthProvider.credential(user.email!, oldPassword);
            reauthenticateWithCredential(user, credential)
                .then(async () => {
                    updatePassword(user, newPassword)
                        .then(() => {
                            resolve("Successfully updated password");
                        })
                        .catch((error) => {
                            const code = (error as AuthError).code;
                            if (code === "auth/weak-password") {
                                reject("New password should be at least 6 characters");
                            } else {
                                reject("Error updating password. Please try again later.");
                            }
                        });
                })
                .catch((error) => {
                    const code = (error as AuthError).code;
                    if (code === "auth/wrong-password") {
                        reject("Your original password is incorrect.");
                    } else if (code === "auth/too-many-request") {
                        reject(`Access to this account has been temporarily disabled due to many failed
            login attempts or due to too many failed password resets. Please try again later`);
                    } else {
                        reject("Failed to authenticate user. Please log in again.");
                    }
                });
        } else {
            reject("Session expired. Please sign in again.");
        }
    });
}
