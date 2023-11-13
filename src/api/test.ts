import { Hash, createHash } from "crypto";

type Children = {
    firstName: string,
    lastName: string,
    age: number,
    birthYear: number,
    school: string,
}

type User = {
    uid: number,
    newEmail: string,
    password: Hash,
    newFirstName: string,
    newLastName: string,
    phoneNumber: number,
    zipCode: number,
    children: Children[],
    notifcations: boolean,
}


export const user: User = {
    uid: 1101,
    newEmail: "person@gmail.com",
    password: createHash("sha256"),
    newFirstName: "John",
    newLastName: "Doe",
    phoneNumber: 1234567890,
    zipCode: 20001,
    children: [{
        firstName: "Jane",
        lastName: "Doe",
        age: 12,
        birthYear: 2011,
        school: "Elementary School",
    },
    {
        firstName: "Jane",
        lastName: "Doe",
        age: 12,
        birthYear: 2011,
        school: "Elementary School",
    }],
    notifcations: false,
};