import { httpsCallable } from "firebase/functions";
import { functions } from "@/config";
import { type Event } from "@/types";

export const createEvent = async (event: Event) => {
    const createEventCloudFunction = httpsCallable(functions, "createEvent");
    return await createEventCloudFunction(event);
};

export const updateEvent = async (event: Event) => {
    const updateEventCloudFunction = httpsCallable(functions, "updateEvent");
    return await updateEventCloudFunction(event);
};

export const deleteEvent = async (id: number) => {
    const deleteEventCloudFunction = httpsCallable(functions, "deleteEvent");
    return await deleteEventCloudFunction(id);
};

export const getEvents = async () => {
    const getEventsCloudFunction = httpsCallable(functions, "getEvents");
    return await getEventsCloudFunction();
};
