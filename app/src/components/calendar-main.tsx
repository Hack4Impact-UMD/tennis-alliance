import React, { useEffect, useRef, useState } from 'react';
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import DayGrid from '@event-calendar/day-grid';
import Interaction from '@event-calendar/interaction'
import { type CustomEvent } from "@/types";
import '@event-calendar/core/index.css';

// Define the event type structure (optional, but useful for type safety)
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

const MyCalendar: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<CalendarEvent[]>([]);

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
      const eventsByDate: { [key: string]: CalendarEvent[]} = {};

      // Count events per date and create aggregated event entries
      customEvents.forEach(event => {
        const dateKey = event.date; // Get the date (YYYY-MM-DD)
        eventCountByDate[dateKey] = (eventCountByDate[dateKey] || 0) + 1;
        if(!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }
        if(event.id){
          eventsByDate[dateKey].push({
            id: event.id,
            title: event.title,
            start: `${event.date}T${event.startTime}`,
            end: `${event.date}T${event.endTime}`,
            description: event.description
          });
        }
      });

      // Create aggregated events for the calendar
      Object.keys(eventCountByDate).forEach(date => {
        calendarEvents.push({
          id: date, // Use date as a unique ID
          title: `${eventCountByDate[date]} event${eventCountByDate[date] > 1 ? 's' : ''}`,
          start: `${date}T00:00`, // Set a dummy start time
          end: `${date}T23:59`, // Set a dummy end time
          description: 'temporary description',
        });
      });

      // Initialize the calendar
      const ec = new Calendar({
        target: calendarRef.current,
        props: {
          plugins: [TimeGrid, DayGrid, Interaction],
          options: {
            view: 'dayGridMonth',
            events: calendarEvents,
            eventContent: (info) => {
              return info.event.title; // Use the aggregated title
            },
            dateClick: (info) => {
              const clickedDate = info.date.toISOString().split('T')[0];
              setSelectedDate(clickedDate);
              setEventsForSelectedDate(eventsByDate[clickedDate] || []);
              console.log("Date Event List:", eventsForSelectedDate);
            }
          },
        },
      });

      return () => {
        ec.destroy();
      };
    }
  }, []);

  return (
    <div>
      <div ref={calendarRef}></div>
      {selectedDate && (
        <div>
          <h3>Events for {selectedDate}:</h3>
          {eventsForSelectedDate.length > 0 ? (
            <ul>
              {eventsForSelectedDate.map(event => (
                <li key={event.id}>
                  <strong>{event.title}</strong> ({event.start} - {event.end})
                  <p>{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No events for this day.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
