import { db, functions } from "@/config";
import { CustomEvent, User, Children, ChildrenWithId } from "@/types";
import type { DocumentReference } from "firebase/firestore";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    runTransaction,
    updateDoc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export async function getUserWithId(id: string): Promise<User> {
    const userDoc = await getDoc(doc(db, "Users", id));
    if (userDoc.exists()) {
        return userDoc.data() as User;
    } else {
        throw new Error("User does not exist");
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
    // console.log("Additional info updated successfully.");
    } catch (error) {
        console.error("Error updating additional info:", error);
        throw error;
    }
}

export async function getChildren(uid: string): Promise<ChildrenWithId[]> {
    try {
        const userRef = doc(db, "Users", uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            return data.children || [];
        } else {
            console.error("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error fetching children:", error);
        throw error;
    }
}

export async function updateChildren(
    uid: string,
    updatedChildren: Children[]
): Promise<void> {
    try {
        const userRef = doc(db, "Users", uid);

        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            throw new Error(`User with ID ${uid} does not exist.`);
        }

        await updateDoc(userRef, { children: updatedChildren });

    // console.log("Children array updated successfully.");
    } catch (error) {
        console.error("Error updating children:", error);
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
                    (doc) => ({
                        ...(doc.data() as CustomEvent),
                        id: doc.id,
                    })
                );
                resolve(events);
            })
            .catch(() => reject());
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
        const year = selectedDay.getFullYear();
        const month = String(selectedDay.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDay.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

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

        const year = selectedDay.getFullYear();
        const month = String(selectedDay.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDay.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        const updatedEvent = {
            title: eventName,
            date: formattedDate,
            start: `${startTime.hours}:${startTime.minutes} ${startTime.period}`,
            end: `${endTime.hours}:${endTime.minutes} ${endTime.period}`,
            description,
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

export async function adminDeleteParticipant(
    event: CustomEvent,
    eventId: string,
    participantId: string,
    attendeeName: { firstName: string; lastName: string },
    participantEmail: string,
    email: boolean
): Promise<void> {
    if (!eventId) {
        throw new Error("Invalid id");
    }

    if (email) {
        const sendEmailCloud = httpsCallable(functions, "sendEmail");
        try {
            const removedAttendeeName = `${attendeeName.firstName} ${attendeeName.lastName}`;
            await sendEmailCloud({
                text: `An admin has removed ${removedAttendeeName} from the event ${event.title}.`,
                bcc: [participantEmail],
                reason: "Event Removal",
            });
        } catch (error) {
            console.error("Email failed to send:", error);
        }
    }

    try {
        const userRef = doc(db, "Users", participantId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const userEvents = Array.isArray(userData.events) ? userData.events : [];
            const updatedUserEvents = userEvents
                .map((registeredEvent: { id: string; participants?: { firstName: string; lastName: string }[] }) => {
                    if (registeredEvent.id !== eventId) {
                        return registeredEvent;
                    }

                    const remainingParticipants = Array.isArray(registeredEvent.participants)
                        ? registeredEvent.participants.filter(
                            (member) =>
                                member.firstName !== attendeeName.firstName ||
                  member.lastName !== attendeeName.lastName
                        )
                        : [];

                    return {
                        ...registeredEvent,
                        participants: remainingParticipants,
                    };
                })
                .filter((registeredEvent: { id: string; participants?: { firstName: string; lastName: string }[] }) => {
                    if (registeredEvent.id !== eventId) {
                        return true;
                    }

                    return Array.isArray(registeredEvent.participants) && registeredEvent.participants.length > 0;
                });

            event.participants = event.participants
                .map((participant) => {
                    if (participant.mainId !== participantId) {
                        return participant;
                    }

                    const remainingMembers = participant.otherMembers.filter(
                        (member) =>
                            member.firstName !== attendeeName.firstName ||
              member.lastName !== attendeeName.lastName
                    );

                    return {
                        ...participant,
                        otherMembers: remainingMembers,
                    };
                })
                .filter((participant) => participant.mainId !== participantId || participant.otherMembers.length > 0);

            await updateDoc(userRef, {
                events: updatedUserEvents,
            });
        }

        const extractTime = (value: string) => {
            let timePart = "";
            let encounteredT = false;
  
            for (let i = value.length - 1; i >= 0; i--) {
                if (value[i] === "T") {
                    encounteredT = true;
                    break;
                }
                timePart += value[i];
            }
  
            return encounteredT ? timePart.split("").reverse().join("") : value;
        };
  
        const fixedStart = extractTime(String(event.start));
        const fixedEnd = extractTime(String(event.end));
  
        await updateDoc(doc(db, "Events", eventId), {
            title: event.title,
            description: event.description,
            participants: event.participants,
            maxParticipants: event.maxParticipants,
            maxVolunteers: event.maxVolunteers,
            date: event.date,
            start: fixedStart,
            end: fixedEnd,
        });
    } catch (err) {
        console.error("Error updating event:", err);
        throw err;
    }
  
  
  
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

                const eventData = eventSnapshot.data() as CustomEvent;
                const participants = eventData?.participants || [];

                if (participants.length > 0) {
                    const participantEmails = participants.map((p) => p.email);

                    const sendEmailCloud = httpsCallable(functions, "sendEmail");
                    try {
                        await sendEmailCloud({
                            text: `The ${eventData.title} event has been cancelled.`,
                            bcc: participantEmails,
                            reason: "Event Cancellation",
                        });
                    } catch (error) {
                        console.error(
                            `Failed to send cancellation email for event ${eventId}. Proceeding with delete.`,
                            error
                        );
                    }
                }

                await runTransaction(db, async (transaction) => {
                    const userDocRefs: DocumentReference[] = Array.from(
                        new Map<string, DocumentReference>(
                            participants.map(
                                (participant): [string, DocumentReference] => [
                                    participant.mainId,
                                    doc(db, "Users", participant.mainId),
                                ]
                            )
                        ).values()
                    );

                    const userSnapshots = await Promise.all(
                        userDocRefs.map((userDocRef) => transaction.get(userDocRef))
                    );

                    userSnapshots.forEach((userSnapshot, index) => {
                        const userDocRef = userDocRefs[index];

                        if (userSnapshot.exists()) {
                            const userData = userSnapshot.data();
                            const updatedUserEvents = (userData?.events || []).filter(
                                (event: { id: string }) => event.id !== eventId
                            );

                            transaction.update(userDocRef, { events: updatedUserEvents });
                        }
                    });

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
