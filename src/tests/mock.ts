import { User, Event } from "@/types";

const user: User = {
    id: 1000,
    email: "person@gmail.com",
    password: "123456",
    firstName: "John",
    lastName: "Doe",
    phone: 1234567890,
    zip: 20001,
    children: [
        {
            id: 1001,
            firstName: "Jane",
            lastName: "Doe",
            age: 12,
            birthYear: 2011,
            school: "Middle School",
        },
        {
            id: 1002,
            firstName: "Jane",
            lastName: "Doe",
            age: 13,
            birthYear: 2010,
            school: "Middle School",
        },
    ],
    notifications: false,
};

const event: Event = {
    id: 1,
    title: "Event Title",
    startDate: new Date("2023-12-01T16:00:00"),
    endDate: new Date("2023-12-01T18:00:00"),
    description: "Event Description",
    participants: [1001, 1002],
    slots: 10,
};

const participants = [
    {
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@gmail.com",
        type: "Volunteer",
        age: "10",
        town: "Jersey City",
    },
    {
        first_name: "Jane",
        last_name: "Dame",
        email: "janedoe@gmail.com",
        type: "Participant",
        age: "11",
        town: "Jersey City",
    },
    {
        first_name: "Jason",
        last_name: "Doe",
        email: "jasondoe@gmail.com",
        type: "Participant",
        age: "15",
        town: "Jersey City",
    },
];

export { user, event, participants };
