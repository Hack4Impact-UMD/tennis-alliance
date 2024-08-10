import { db, functions } from "@/config";
import { CustomEvent, User } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export function getUserWithId(id: string): Promise<User> {
  return new Promise((resolve, reject) => {
    getDoc(doc(db, "Users", id))
      .then((user) => {
        if (user.exists()) {
          resolve(user.data() as User);
        } else {
          reject(new Error("User does not exist"));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function updateUser(user: User): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!user.auth_id) {
      reject(new Error("Invalid id"));
      return;
    }

    const userRef = doc(db, "Users", user.auth_id);
    updateDoc(userRef, { ...user })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}
export function adminGetEvents(): Promise<CustomEvent[]> {
  return new Promise((resolve, reject) => {
    getDocs(collection(db, "Events"))
      .then((querySnapshot) => {
        const events: CustomEvent[] = querySnapshot.docs.map(
          (doc) => doc.data() as CustomEvent
        );
        return events;
      })
      .catch((e) => reject());
  });
}
export function adminCreateEvent(event: CustomEvent): Promise<void> {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, "Events"), event)
      .then((docRef) => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function adminUpdateEvent(
  event: CustomEvent,
  eventId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!eventId) {
      reject(new Error("Invalid id"));
      return;
    }

    const eventRef = doc(db, "Events", eventId);
    updateDoc(eventRef, { ...event })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function adminDeleteParticipant(
  event: CustomEvent,
  eventId: string,
  participantId: string,
  participantEmail: string,
  email: boolean
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (!eventId) {
      reject(new Error("Invalid id"));
      return;
    }
    if (email) {
      const sendEmailCloud = httpsCallable(functions, "sendEmail");
      sendEmailCloud({
        text: `An admin has removed you from the event ${event.title}`,
        bcc: [participantEmail],
        reason: "Event Removal",
      }).catch((error: any) => {
        reject(error);
      });
    }

    event.participants = event.participants.filter(
      (e) => e.mainId !== participantId
    );
    const user: User | void = await getUserWithId(participantId).catch(
      (err) => {
        reject();
      }
    );
    if (user) {
      user.events = user?.events.filter((e) => e.id !== eventId);
    }
    const batch = writeBatch(db);
    const eventRef = doc(db, "Events", eventId);
    const userRef = doc(db, "Users", participantId);
    batch.update(eventRef, { ...event });
    batch.update(userRef, { ...user });
    batch
      .commit()
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function adminDeleteEvent(
  event: CustomEvent,
  eventId: string,
  email: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!eventId) {
      reject(new Error("Invalid id"));
      return;
    }
    const eventEmails = event.participants.map((e) => e.email);
    if (email) {
      const sendEmailCloud = httpsCallable(functions, "sendEmail");
      sendEmailCloud({
        text: `The ${event.title} event has been cancelled.`,
        bcc: [eventEmails],
        reason: "Event Cancellation",
      }).catch((error: any) => {
        reject(error);
      });
    }

    runTransaction(db, async (transaction) => {
      const getPromises: Promise<any>[] = [];
      event.participants.forEach((participant) => {
        getPromises.push(transaction.get(doc(db, "Users", participant.mainId)));
      });
      const users: User[] = await Promise.all(getPromises).then((res) => {
        return res.map((doc) => doc.data());
      });
      const writePromises: any[] = [];
      users.forEach((user) => {
        user.events = user.events.filter((e) => e.id !== eventId);
        writePromises.push(
          transaction.update(doc(db, "Users", user.auth_id!), { ...user })
        );
      });
      await Promise.all(writePromises);
      transaction.delete(doc(db, "Events", eventId));
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject();
      });
  });
}
