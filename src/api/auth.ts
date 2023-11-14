import { functions } from "../config";

import { httpsCallable } from "firebase/functions";
import { Hash } from "crypto";

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
    // password: Hash;
    newFirstName: string;
    newLastName: string;
    phoneNumber: number;
    zipCode: number;
    children: Children[];
    notifcations: boolean;
};

export function createUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
        const createUserCloudFunction: CallableFunction = httpsCallable(
            functions,
            "createUser"
        );
        createUserCloudFunction({
            id: user?.uid,
            email: user?.newEmail,
            // pass: user?.password,
            firstName: user?.newFirstName,
            lastName: user?.newLastName,
            phone: user?.phoneNumber,
            zip: user?.zipCode,
            children: user?.children,
            notifs: user?.notifcations,
        })
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
