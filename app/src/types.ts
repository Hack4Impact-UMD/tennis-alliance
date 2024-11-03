type User = {
  auth_id?: string;
  accountType: string;
  email: string;
  firstName: string;
  lastName: string;
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
  startTime: string;
  endTime: string;
  description: string;
  participants: {
    email: string;
    mainId: string;
    mainFirstName: string;
    mainLastName: string;
    otherMembers: { firstName: string; lastName: string }[];
  }[];
  slots: number;
};

export type { CustomEvent, User, Children };
