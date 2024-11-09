import app, { functions } from "@/config";
import { User } from "@/types";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";

/*
 * Creates a user and sends a password reset email to that user.
 */
export function createUser(user: User): Promise<void> {
  return new Promise((resolve, reject) => {
    const createUserCloudFunction = httpsCallable(functions, "createUser");
    const auth = getAuth(app);
    console.log(user);
    createUserCloudFunction({ email: user.email, user: user })
      .then(async () => {
        await sendPasswordResetEmail(auth, user.email)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject();
          });
      })
      .catch((error) => {
        console.log(error);
        reject();
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
      .then((res: any) => {
        console.log(res);
        resolve([res.data.priorEvents, res.data.registeredUpcoming, res.data.upcomingEvents])
      })
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
