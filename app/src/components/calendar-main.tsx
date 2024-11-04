import React, { useEffect, useRef, useState } from 'react';
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import DayGrid from '@event-calendar/day-grid';
import Interaction from '@event-calendar/interaction'
import TodayEvents from './today-events';
import UpcomingEvents from './upcoming-events';
import { type CustomEvent } from "@/types";
import styles from "@/styles/calendar-main.module.css";
import {fetchEvents, addUserToEvent, sendEmail} from '@/backend/CloudFunctionsCalls';
import {adminGetEvents} from '@/backend/FirestoreCalls';
import '@event-calendar/core/index.css';
import { useAuth } from '@/auth/AuthProvider';
import { adminDeleteEvent, adminUpdateEvent } from '@/backend/FirestoreCalls';
import DeletePopUp from '@/pages/admin-event-delete-popup';
import EditPopup from '@/pages/admin-event-edit-popup';

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
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<CustomEvent[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CustomEvent[]>([]);
  const [todayEvents, setTodayEvents] = useState<CustomEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CustomEvent[]>([]);
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const auth = useAuth();

  useEffect(() => {
    const fetchAllEvents = async () => {

      if(!auth.loading){
        console.log("Auth user: ", auth.user);
        const await_response = await fetchEvents(auth.user.uid);
        console.log("Await response: ", await_response);
        console.log("Await upcoming array: ", await_response[2]);
        setEvents(await_response[2]);
      }
    }

    fetchAllEvents();
  }, [auth.loading]);

  useEffect(() => {

    if (calendarRef.current) {
      /*const customEvents: CustomEvent[] = [
  {
    id: '1',
    title: 'Beginner Tennis Session',
    date: '2024-10-27', // Updated to the first day of the upcoming week
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
    date: '2024-10-28',
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
    date: '2024-10-28',
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
  {
    id: '4',
    title: 'Morning Pickleball Session',
    date: '2024-10-29',
    startTime: '09:00',
    endTime: '10:30',
    description: 'A casual pickleball session for all skill levels.',
    participants: [
      {
        email: 'participant4@example.com',
        mainId: '789',
        mainFirstName: 'Alice',
        mainLastName: 'Johnson',
        otherMembers: [{ firstName: 'Bob', lastName: 'Smith' }],
      },
    ],
    slots: 12,
  },
  {
    id: '5',
    title: 'Afternoon Tennis Match',
    date: '2024-10-29',
    startTime: '13:00',
    endTime: '15:00',
    description: 'A fun match for intermediate tennis players.',
    participants: [
      {
        email: 'participant5@example.com',
        mainId: '790',
        mainFirstName: 'David',
        mainLastName: 'Wilson',
        otherMembers: [{ firstName: 'Charlie', lastName: 'Lee' }],
      },
    ],
    slots: 10,
  },
  {
    id: '6',
    title: 'Pickleball Practice',
    date: '2024-10-30',
    startTime: '16:00',
    endTime: '18:00',
    description: 'A practice session for pickleball players at all levels.',
    participants: [
      {
        email: 'participant6@example.com',
        mainId: '791',
        mainFirstName: 'Eve',
        mainLastName: 'Garcia',
        otherMembers: [{ firstName: 'Frank', lastName: 'Martinez' }],
      },
    ],
    slots: 8,
  },
  {
    id: '7',
    title: 'Tennis Clinic',
    date: '2024-10-31',
    startTime: '10:00',
    endTime: '12:00',
    description: 'A tennis clinic to help players improve their techniques.',
    participants: [
      {
        email: 'participant7@example.com',
        mainId: '792',
        mainFirstName: 'George',
        mainLastName: 'King',
        otherMembers: [{ firstName: 'Helen', lastName: 'Smith' }],
      },
    ],
    slots: 15,
  },
  {
    id: '8',
    title: 'Pickleball Doubles Tournament',
    date: '2024-11-01',
    startTime: '14:00',
    endTime: '17:00',
    description: 'A doubles tournament for advanced pickleball players.',
    participants: [
      {
        email: 'participant8@example.com',
        mainId: '793',
        mainFirstName: 'Ivy',
        mainLastName: 'Taylor',
        otherMembers: [{ firstName: 'Jack', lastName: 'Brown' }],
      },
    ],
    slots: 16,
  },
  {
    id: '12',
    title: 'Pickleball Friendly Round Robin',
    date: '2024-11-01',
    startTime: '17:00',
    endTime: '18:00',
    description: 'A beginner-friendly low-competitive tournament.',
    participants: [
      {
        email: 'participant8@example.com',
        mainId: '793',
        mainFirstName: 'Ivy',
        mainLastName: 'Taylor',
        otherMembers: [{ firstName: 'Jack', lastName: 'Brown' }],
      },
    ],
    slots: 16,
  },
  {
    id: '9',
    title: 'Beginner Tennis Workshop',
    date: '2024-10-26',
    startTime: '09:00',
    endTime: '11:00',
    description: 'A workshop for beginners to learn tennis basics.',
    participants: [
      {
        email: 'participant9@example.com',
        mainId: '794',
        mainFirstName: 'Kathy',
        mainLastName: 'Moore',
        otherMembers: [{ firstName: 'Larry', lastName: 'Jones' }],
      },
    ],
    slots: 20,
  },
];*/


      // Transform CustomEvent to the structure that the Calendar library expects
      const calendarEvents: CustomEvent[] = [];
      const eventCountByDate: { [key: string]: number } = {};
      const eventsByDate: { [key: string]: CustomEvent[]} = {};

      const today = new Date().toISOString().split('T')[0];
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);

      const todayEventList: CustomEvent[] = [];
      const upcomingEventList: CustomEvent[] = [];


      // Count events per date and create aggregated event entries
      console.log("events: ", events);
      events.forEach(event => {
        const dateKey = event.date; // Get the date (YYYY-MM-DD)
        eventCountByDate[dateKey] = (eventCountByDate[dateKey] || 0) + 1;
        let eventObj = {
          id: '',
          title: '',
          start: '',
          end: '',
          description: '',
          date: '',
          /*participants: [],*/
          maxParticipants: 0,
          maxVolunteers: 0,
        };
        if(!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }
        if(event.id){
            eventObj = {
            id: event.id,
            title: event.title,
            start: `${event.date}T${event.start}`,
            end: `${event.date}T${event.end}`,
            description: event.description,
            date: event.date,
            /*participants: event.participants,*/
            maxParticipants: event.maxParticipants,
            maxVolunteers: event.maxVolunteers,
          };
        }
        console.log("eventObj: ", eventObj);
        eventsByDate[dateKey].push(eventObj);
        if(dateKey === today){
          todayEventList.push(eventObj);
        }

        const eventDate = new Date(dateKey);
        if(eventDate > new Date(today) && eventDate <= oneWeekLater){
          upcomingEventList.push(eventObj);
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
          date: date,
          /*participants: [],*/
          maxParticipants: 0,
          maxVolunteers: 0,
        });
      });
      
      setTodayEvents(todayEventList);
      setUpcomingEvents(upcomingEventList);
      setCalendarEvents(calendarEvents);

      console.log("todayEvents: ", todayEvents);
      console.log("upcomingEvents: ", upcomingEvents);
      console.log("calendarEvents: ", calendarEvents);

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
            }
          },
        },
      });

      return () => {
        ec.destroy();
      };
    }
  }, [events]);

  return (
    <div>
      {/*div for registered events container*/}
      <div className = {styles.registeredContainer}>
        <div className = {styles.eventRegisteredBox}>
          <p>Events Registered</p>
        </div>
        {/* add registered events in here*/}
      </div>
      {/*div for new events header*/}
      <div className = {styles.eventNewBox}>
        <p>New Events:</p>
      </div>
      {/*div for calendar*/}
      <div ref={calendarRef} className = {styles.calendarDiv}></div>

      {/* div for today's events */}
      <TodayEvents events={todayEvents} />

      {/* div for upcoming events container */}
      <div className = {styles.upcomingContainer}>
        <div className = {styles.upcomingBox}>
          <h3>Upcoming Events</h3>
        </div>
        <UpcomingEvents events={selectedDate ? eventsForSelectedDate : upcomingEvents} />
      </div>
    </div>
  );
};

export default MyCalendar;
