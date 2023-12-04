import { functions } from "../config";
import { httpsCallable } from "firebase/functions";

export const createEvent = async (event: any) => {
    const createEventCloudFunction = httpsCallable(functions, "createEvent");

    return await createEventCloudFunction(event);
};

export const getEvents = async () => {
    const getEventsCloudFunction = httpsCallable(functions, "getEvents");

    return await getEventsCloudFunction();
};
