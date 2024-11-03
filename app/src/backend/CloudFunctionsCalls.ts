import app, { functions } from "@/config";
import { User } from "@/types";
import {
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
/*
export function createUserWithEmailAndPassword(user: User, password: string): Promise<void>{
    return new Promise((resolve, reject) => {
        const createUserCloudFunction = httpsCallable(functions, "createUserWithEmailAndPassword");
        const auth = getAuth(app);
        console.log(user);
        createUserCloudFunction({email: user.email, password})
            //above code making problems, ask to resolve
            .catch((error) => {
                console.log(error);
                reject();
            });
    });
}*/
/*
 * Creates a user and sends a password reset email to that user.
 */
/*export function createUser(user: User, password:string): Promise<void> {
    return new Promise((resolve, reject) => {
        const createUserCloudFunction = httpsCallable(functions, "createUser");
        const auth = getAuth(app);
        console.log(user);
        await createUserCloudFunction({ auth, email: user.email, password: password, user: user })
        resolve();
            /*.then(async () => {
            // Attempt to send password reset email after user creation
                try {
                    await sendPasswordResetEmail(auth, user.email);
                    resolve();
                } catch (error) {
                    console.log("Error sending password reset email:", error);
                    reject(error); // Pass the error along if there's an issue
                }
            })
            //above code making problems, ask to resolve
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}*/

export function createUser(user: User, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const createUserCloudFunction = httpsCallable(functions, "createUser");
        const auth = getAuth(app);

        console.log(user);

        createUserCloudFunction({ auth, email: user.email, password, user })
            .then(() => {
                resolve(); // Resolve the promise after the cloud function succeeds
            })
            .catch((error) => {
                console.log(error);
                reject(error); // Reject the promise if there's an error
            });
    });
}

export function updateUserEmail(
    oldEmail: string,
    newEmail: string,
    password: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        const auth = getAuth(app);
        const user = auth.currentUser!;
        const credential = EmailAuthProvider.credential(oldEmail, password);
        reauthenticateWithCredential(user, credential).then(async () => {
            const updateUserEmailCloudFunction = httpsCallable(
                functions,
                "updateUserEmail"
            );

            updateUserEmailCloudFunction({ email: oldEmail, newEmail: newEmail })
                .then(async (res) => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
}

export function sendEmail(email: string, text: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const sendEmailCloud = httpsCallable(functions, "sendEmail");
        sendEmailCloud({
            text: text,
            bcc: [email],
            reason: "",
        })
            .then(() => resolve())
            .catch((error: any) => {
                reject(error);
            });
    });
}

export function fetchEvents(auth_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const getEvents = httpsCallable(functions, "getEvents");
        getEvents({
            auth_id: auth_id,
        })
            .then((res: any) =>
                resolve([res.priorEvents, res.registeredUpcoming, res.upcoming])
            )
            .catch((error: any) => {
                reject(error);
            });
    });
}

export function deleteUserFromEvent(
    auth_id: string,
    eventId: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        const removeUserFromEvent = httpsCallable(functions, "removeUserFromEvent");
        removeUserFromEvent({
            auth_id: auth_id,
            eventId: eventId,
        })
            .then(() => resolve())
            .catch((error: any) => {
                reject(error);
            });
    });
}

export function addUserToEvent(
    auth_id: string,
    eventId: string,
    members: { firstName: string; lastName: string }[]
): Promise<void> {
    return new Promise((resolve, reject) => {
        const addUserToEvent = httpsCallable(functions, "addUserToEvent");
        addUserToEvent({
            auth_id: auth_id,
            eventId: eventId,
            members: members,
        })
            .then(() => resolve())
            .catch((error: any) => {
                reject(error);
            });
    });
}
