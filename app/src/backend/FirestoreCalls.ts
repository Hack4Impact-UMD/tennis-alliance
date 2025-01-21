import { db, functions } from "@/config";
import { CustomEvent, User } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  runTransaction,
  updateDoc,
  writeBatch,
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

export function adminGetUsers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    getDocs(collection(db, "Users"))
      .then((querySnapshot) => {
        const users: User[] = querySnapshot.docs.map(
          (doc) => doc.data() as User
        );
        resolve(users);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export async function getAdditionalInfo(uid: string): Promise<{
  backgroundAndInterests: string;
  skills: string[];
  otherDetails?: string;
} | null> {
  try {
    const userRef = doc(db, "Users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.additionalInfo || null; // Return the additionalInfo field if it exists
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching additional info:", error);
    throw error;
  }
}

export async function updateAdditionalInfo(
  uid: string,
  additionalInfo: {
    backgroundAndInterests: string;
    skills: string[];
    otherDetails?: string;
  }
): Promise<void> {
  try {
    const userRef = doc(db, "Users", uid);
    await updateDoc(userRef, {
      additionalInfo,
    });
    console.log("Additional info updated successfully.");
  } catch (error) {
    console.error("Error updating additional info:", error);
    throw error;
  }
}


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
    const userCollectionRef = collection(db, "Users");

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

    addDoc(collection(db, "Users"), user)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createFamily(
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
  altEmail: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const familyCollectionRef = collection(db, "Users");

    addDoc(familyCollectionRef, {
      email,
      firstName,
      lastName,
      phone: Number(phone),
      zip: Number(zip),
      notifications,
      waiver,
      altName,
      altEmail,
      children,
      events: [],
      createdAt: new Date(),
      type,
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
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

export function adminGetEventIDs(): Promise<{ [key: string]: string }> {
  return new Promise((resolve, reject) => {
    getDocs(collection(db, "Events"))
      .then((querySnapshot) => {
        const eventsById: { [key: string]: string } = {};
        querySnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.title && doc.id) {
            eventsById[data.title] = doc.id;
          }
        });
        resolve(eventsById);
      })
      .catch(() => reject());
  });
}

export function adminGetEventById(eventId: string): Promise<CustomEvent> {
  return new Promise((resolve, reject) => {
    if (!eventId) {
      reject(new Error("Invalid event id"));
      return;
    }

    const eventRef = doc(db, "Events", eventId);
    getDoc(eventRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const event = docSnapshot.data() as CustomEvent;
          resolve(event);
        } else {
          reject(new Error("Event not found"));
        }
      })
      .catch((e) => reject(e));
  });
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
      start: `${startTime.hours}:${startTime.minutes} ${startTime.period}`,
      end: `${endTime.hours}:${endTime.minutes} ${endTime.period}`,
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
  eventId: string,
  eventName: string,
  startTime: { hours: string; minutes: string; period: string },
  endTime: { hours: string; minutes: string; period: string },
  selectedDay: Date,
  maxParticipants: number,
  maxVolunteers: number,
  description: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!eventId) {
      reject(new Error("Invalid id"));
      return;
    }

    const formattedDate = selectedDay.toISOString().split('T')[0];

    const updatedEvent: CustomEvent = {
      title: eventName,
      date: formattedDate,
      start: `${startTime.hours}:${startTime.minutes} ${startTime.period}`,
      end: `${endTime.hours}:${endTime.minutes} ${endTime.period}`,
      description,
      participants: [],
      maxParticipants: maxParticipants,
      maxVolunteers: maxVolunteers,
    };

    const eventRef = doc(db, "Events", eventId);
    updateDoc(eventRef, { ...updatedEvent })
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
  // event: CustomEvent,
  eventId: string,
  // email: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!eventId) {
      reject(new Error("Invalid id"));
      return;
    }

    const eventDocRef = doc(collection(db, "Events"), eventId);
    getDoc(eventDocRef)
      .then(async (eventSnapshot) => {
        if (!eventSnapshot.exists()) {
          reject(new Error("Event not found"));
          return;
        }

        const eventData = eventSnapshot.data();
        const participants = eventData?.participants || [];

        if (participants.length > 0) {
          const participantEmails = participants.map((p: any) => p.email);

          const sendEmailCloud = httpsCallable(functions, "sendEmail");
          await sendEmailCloud({
            text: `The ${eventData.title} event has been cancelled.`,
            bcc: participantEmails,
            reason: "Event Cancellation",
          });
        }

        await runTransaction(db, async (transaction) => {
          for (const participant of participants) {
            const userDocRef = doc(db, "Users", participant.mainId);
            const userSnapshot = await transaction.get(userDocRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              const updatedRegisteredEvents = (userData?.registeredEvents || []).filter(
                (event: string) => event !== eventId
              );

              transaction.update(userDocRef, { registeredEvents: updatedRegisteredEvents });
            }
          }

          transaction.delete(eventDocRef);
        });
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
