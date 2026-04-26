import { CustomEvent, User } from "@/types";

const user: User = {
    auth_id: "1000",
    email: "person@gmail.com",
    firstName: "John",
    lastName: "Doe",
    phone: 1234567890,
    zip: 20001,
    events: [],
    children: [
        {
            childFirstName: "Jane",
            childLastName: "Doe",
            childAge: 12,
            childBirthYear: 2011,
            childSchool: "Middle School",
        },
        {
            childFirstName: "Jane",
            childLastName: "Doe",
            childAge: 13,
            childBirthYear: 2010,
            childSchool: "Middle School",
        },
    ],
    notifications: false,
    waiver: true,
    createdAt: new Date("2023-01-01T00:00:00"),
    type: "family",
};

const event: CustomEvent = {
    id: "1",
    title: "Event Title",
    date: "2023-12-01",
    start: "16:00",
    end: "18:00",
    description: "Event Description",
    participants: [
        {
            email: "person@gmail.com",
            mainId: "1000",
            mainFirstName: "John",
            mainLastName: "Doe",
            otherMembers: [
                { firstName: "John", lastName: "Doe" },
                { firstName: "Jane", lastName: "Doe" },
            ],
            role: "participant",
        },
    ],
    maxParticipants: 10,
    maxVolunteers: 5,
};

const users = [
    {
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@gmail.com",
        type: "Volunteer",
        age: "18",
    },
    {
        first_name: "Jane",
        last_name: "Dame",
        email: "janedoe@gmail.com",
        type: "Participant",
        age: "11",
    },
    {
        first_name: "Jason",
        last_name: "Doe",
        email: "jasondoe@gmail.com",
        type: "Participant",
        age: "15",
    },
];

export { user, event, users };
