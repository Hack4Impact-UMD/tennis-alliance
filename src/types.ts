type User = {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: number;
    zip: number;
    children: Children[];
    notifications: boolean;
};

type Children = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    birthYear: number;
    school: string;
};

type Event = {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    participants: number[];
    slots: number;
};

export type { User, Children, Event };
