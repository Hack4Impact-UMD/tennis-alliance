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
import Image from "next/image";
import TennisBalls from "@/assets/tennis_balls.png";

// Define the event type structure (optional, but useful for type safety)
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

// Function to format the date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00Z'); // Ensure it's treated as UTC
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };

  return date.toLocaleDateString('en-US', options);
};

const MyCalendar: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<CustomEvent[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CustomEvent[]>([]);
  const [todayEvents, setTodayEvents] = useState<CustomEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CustomEvent[]>([]);
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [todayInEST, setTodayInEST] = useState<string>('');  // New state for today's date in EST
  const auth = useAuth();

  useEffect(() => {
    const fetchAllEvents = async () => {

      if(!auth.loading){
        /*console.log("Auth user: ", auth.user);*/
        const await_response = await fetchEvents(auth.user.uid);
        /*console.log("Await response: ", await_response);
        console.log("Await upcoming array: ", await_response[2]);*/
        setEvents(await_response[2]);
      }
    }

    fetchAllEvents();
  }, [auth.loading]);

  useEffect(() => {

    if (calendarRef.current) {
      
      // Transform CustomEvent to the structure that the Calendar library expects
      const calendarEvents: CustomEvent[] = [];
      const eventCountByDate: { [key: string]: number } = {};
      const eventsByDate: { [key: string]: CustomEvent[]} = {};

      const now = new Date();
      const utcOffset = now.getTimezoneOffset() * 60000; // Convert timezone offset to milliseconds
      const estOffset = 5 * 60 * 60000; // Offset EST is UTC-5 hours
      
      // Get the time in EST by subtracting the difference from UTC
      const estDate = new Date(now.getTime() - utcOffset + estOffset);
      
      // Format the date in EST as YYYY-MM-DD
      const year = estDate.getFullYear();
      const month = String(estDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(estDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setTodayInEST(formattedDate);  // Set the formatted date in state
      console.log("todayInEST: ", todayInEST);

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      const todayEventList: CustomEvent[] = [];
      const upcomingEventList: CustomEvent[] = [];

      // Count events per date and create aggregated event entries
      /*console.log("events: ", events);*/
      events.forEach(event => {
        const dateKey = event.date; // Get the date (YYYY-MM-DD)
        eventCountByDate[dateKey] = (eventCountByDate[dateKey] || 0) + 1;
        let eventObj: CustomEvent = {
          id: '',
          title: '',
          start: '',
          end: '',
          description: '',
          date: '',
          participants: [],
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
            participants: event.participants,
            maxParticipants: event.maxParticipants,
            maxVolunteers: event.maxVolunteers,
          };
        }
        /*console.log("eventObj: ", eventObj);*/
        eventsByDate[dateKey].push(eventObj);
        if(dateKey === todayInEST){
          todayEventList.push(eventObj);
        }

        const eventDate = new Date(dateKey);
        if (eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth) {
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
          participants: [],
          maxParticipants: 0,
          maxVolunteers: 0,
        });
      });
      
      setTodayEvents(todayEventList);
      setUpcomingEvents(upcomingEventList);
      setCalendarEvents(calendarEvents);

      console.log("todayEvents: ", todayEvents);
      /*console.log("upcomingEvents: ", upcomingEvents);
      console.log("calendarEvents: ", calendarEvents);*/

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
      {/* div for registered events container */}
      <div className={styles.registeredContainer}>
        <div className={styles.eventRegisteredBox}>
          <p>Events Registered</p>
        </div>
        
        <div className={styles.noEventsContainer}>
          <div className={styles.iconContainer}>
            <Image src={TennisBalls} alt="LogoIcon" width={50} height={50} style={{ borderRadius: '50%' }}  />
          </div>
          <div className = {styles.noEventsText}>
            <p>Nothing planned for {formatDate(todayInEST)}</p>
          </div>
        </div>
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
          <p>Upcoming Events</p>
        </div>
        <UpcomingEvents events={selectedDate ? eventsForSelectedDate : upcomingEvents} />
      </div>
    </div>
  );
};

export default MyCalendar;
