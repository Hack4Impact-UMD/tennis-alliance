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
  query,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export async function getUserWithId(id: string): Promise<User> {
  try {
    const userDoc = await getDoc(doc(db, "Users", id));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error("User does not exist");
    }
  } catch (e) {
    throw e;
  }
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
        resolve(events);
      })
      .catch((e) => reject());
  });
}

export function adminGetEventIDs(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    getDocs(collection(db, "Events"))
      .then((querySnapshot) => {
        const eventIDs: string[] = querySnapshot.docs.map((doc) => doc.id);
        resolve(eventIDs);
      })
      .catch((e) => reject(e));
  });
}

export async function getEventByID(eventId: string): Promise<CustomEvent> {
  try {
    const eventDoc = await getDoc(doc(db, "Events", eventId));
    if (eventDoc.exists()) {
      return eventDoc.data() as CustomEvent;
    } else {
      throw new Error("Event does not exist");
    }
  } catch (e) {
    throw e;
  }
}

export function adminCreateEvent(
  eventName: string,
  startTime: { hours: string; minutes: string; period: string },
  endTime: { hours: string; minutes: string; period: string },
  selectedDay: Date,
  maxParticipants: number,
  maxVolunteers: number,
  description: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const formattedDate = selectedDay.toISOString().split('T')[0];

    const event: CustomEvent = {
      title: eventName,
      date: formattedDate,
      startTime: `${startTime.hours}:${startTime.minutes} ${startTime.period}`,
      endTime: `${endTime.hours}:${endTime.minutes} ${endTime.period}`,
      description,
      participants: [],
      maxParticipants: maxParticipants,
      maxVolunteers: maxVolunteers,
    };

    addDoc(collection(db, "Events"), event)
      .then(() => {
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

export async function adminDeleteParticipant(
  eventName: string,
  participantId: string,
  participantEmail: string,
  email: boolean
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (!participantId) {
      reject(new Error("Invalid participant id"));
      return;
    }

    if (email) {
      const sendEmailCloud = httpsCallable(functions, "sendEmail");
      sendEmailCloud({
        text: `An admin has removed you from the event ${eventName}`,
        bcc: [participantEmail],
        reason: "Event Removal",
      }).catch((error: any) => {
        reject(error);
      });
    }

    const eventRef = doc(db, "Events", eventName);
    const eventSnap = await getDoc(eventRef);
    const event = eventSnap.data() as CustomEvent | undefined;
    
    if (!event) {
      reject(new Error("Event not found"));
      return;
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
      user.events = user.events.filter((e) => e.id !== eventName);
    }

    const batch = writeBatch(db);
    batch.update(eventRef, { ...event });
    const userRef = doc(db, "Users", participantId);
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
