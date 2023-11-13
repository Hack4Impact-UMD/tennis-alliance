export default interface Event {
    id: number,
    title: string;
    endDateTime?: number; // unix timestamp
    startDateTime?: number; // unix timestamp
    totalSlots: number;
    slotsOpen: number; // not on PRD but on the Figma
    description: string;
    participants: string[]; // array of participant IDs
    volunteers: string[]; // array of volunteer IDs
  }