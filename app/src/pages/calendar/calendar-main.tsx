import React, { useEffect, useRef } from 'react';
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import { type CustomEvent } from "@/types";
import '@event-calendar/core/index.css';

// Define the event type structure (optional, but useful for type safety)
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

const MyCalendar: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (calendarRef.current) {
      const customEvents: CustomEvent[] = [
        {
          id: '1',
          title: 'Beginner Tennis Session',
          date: '2024-10-10',
          startTime: '10:00',
          endTime: '12:00',
          description: 'A beginner-level tennis session for new players.',
          participants: [
            {
              email: 'participant1@example.com',
              mainId: '123',
              mainFirstName: 'John',
              mainLastName: 'Doe',
              otherMembers: [
                { firstName: 'Jane', lastName: 'Doe' },
                { firstName: 'Jake', lastName: 'Smith' }
              ],
            },
          ],
          slots: 10,
        },
        {
          id: '2',
          title: 'Advanced Tennis Match',
          date: '2024-10-11',
          startTime: '14:00',
          endTime: '16:00',
          description: 'A competitive match for advanced tennis players.',
          participants: [
            {
              email: 'participant2@example.com',
              mainId: '456',
              mainFirstName: 'Emily',
              mainLastName: 'Davis',
              otherMembers: [{ firstName: 'Sam', lastName: 'Brown' }],
            },
          ],
          slots: 8,
        },
      ];

      // Transform CustomEvent to the structure that the Calendar library expects
      const calendarEvents = customEvents.map((event) => ({
        id: event.id,
        title: event.title,
        start: `${event.date}T${event.startTime}`,
        end: `${event.date}T${event.endTime}`,
        description: event.description,
      }));

      const ec = new Calendar({
        target: calendarRef.current, // Render in the specified div
        props: {
          plugins: [TimeGrid],
          options: {
            view: 'timeGridWeek',
            events: calendarEvents, // Pass the transformed events here
          },
        },
      });

      return () => {
        ec.destroy(); // Clean up calendar on unmount
      };
    }
  }, []);

  return <div ref={calendarRef}></div>; // Return the div where the calendar will be rendered
};

export default MyCalendar;
