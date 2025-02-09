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
export function createUser(
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  zip: string,
  notifications: boolean,
  waiver: boolean,
  type: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const createUserCloudFunction = httpsCallable(functions, "createUser");
    const auth = getAuth(app);

    const user: User = {
      email,
      firstName,
      lastName,
      phone: Number(phone),
      zip: Number(zip),
      notifications,
      waiver,
      events: [],
      createdAt: new Date(),
      type,
    };

    console.log(user);

    createUserCloudFunction({ email: user.email, user })
      .then(async () => {
        console.log("emailing" + user.email);
        await sendPasswordResetEmail(auth, user.email)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

export function createFamilyUser(
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  zip: string,
  notifications: boolean,
  waiver: boolean,
  children: {
    childFirstName: string;
    childLastName: string;
    childAge: number;
    childBirthYear: number;
    childSchool: string;
  }[],
  type: string,
  altName: string,
  altEmail: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const createFamilyUserCloudFunction = httpsCallable(functions, "createFamilyUser");
    const auth = getAuth(app);

    const user = {
      firstName,
      lastName,
      phone: Number(phone),
      zip: Number(zip),
      notifications,
      waiver,
      children,
      type,
      altName,
      altEmail,
    };

    console.log("Sending data to createFamilyUser Cloud Function:", { email, user });

    createFamilyUserCloudFunction({ email, user })
      .then(async () => {
        console.log("Sending password reset email to " + email);
        await sendPasswordResetEmail(auth, email)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error("Error sending password reset email:", error);
            reject(error);
          });
      })
      .catch((error) => {
        console.error("Error in Cloud Function call:", error);
        reject(error);
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
