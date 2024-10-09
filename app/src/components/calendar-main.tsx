import React, { useEffect, useRef } from 'react';
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import DayGrid from '@event-calendar/day-grid';
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
        {
          id: '3',
          title: 'Coaching Tennis Lessons',
          date: '2024-10-11',
          startTime: '18:00',
          endTime: '20:00',
          description: 'A group learning session for advanced tennis players.',
          participants: [
            {
              email: 'participant3@example.com',
              mainId: '458',
              mainFirstName: 'John',
              mainLastName: 'Davis',
              otherMembers: [{ firstName: 'Sam', lastName: 'Smith' }],
            },
          ],
          slots: 6,
        },
      ];

      // Transform CustomEvent to the structure that the Calendar library expects
      const calendarEvents: CalendarEvent[] = [];
      const eventCountByDate: { [key: string]: number } = {};

      // Count events per date and create aggregated event entries
      customEvents.forEach(event => {
        const dateKey = event.date; // Get the date (YYYY-MM-DD)
        eventCountByDate[dateKey] = (eventCountByDate[dateKey] || 0) + 1;
      });

      // Create aggregated events for the calendar
      Object.keys(eventCountByDate).forEach(date => {
        calendarEvents.push({
          id: date, // Use date as a unique ID
          title: `${eventCountByDate[date]} event${eventCountByDate[date] > 1 ? 's' : ''}`,
          start: `${date}T00:00`, // Set a dummy start time
          end: `${date}T23:59`, // Set a dummy end time
        });
      });

      // Initialize the calendar
      const ec = new Calendar({
        target: calendarRef.current,
        props: {
          plugins: [TimeGrid, DayGrid],
          options: {
            view: 'dayGridMonth',
            events: calendarEvents,
            eventContent: (info) => {
              return info.event.title; // Use the aggregated title
            },
          },
        },
      });

      return () => {
        ec.destroy();
      };
    }
  }, []);

  return <div ref={calendarRef}></div>;
};

export default MyCalendar;
