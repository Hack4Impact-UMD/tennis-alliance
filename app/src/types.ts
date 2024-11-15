type User = {
  auth_id?: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  phone: number;
  zip: number;
  notifications: boolean;
  events: {
    id: string;
    participants: { firstName: string; lastName: string }[];
  }[];
  children?: Children[];
  adults?: { name: string; email: string }[];
};

type Children = {
  firstName: string;
  lastName: string;
  age: number;
  school: string;
};

type CustomEvent = {
  id?: string;
  title: string;
  // yyyy-mm-dd format
  date: string;
  start: string;
  end: string;
  description: string;
  participants: {
    email: string;
    mainId: string;
    mainFirstName: string;
    mainLastName: string;
    otherMembers: { firstName: string; lastName: string }[];
  }[];
  maxParticipants: number;
  maxVolunteers: number;
};

export type { CustomEvent, User };
