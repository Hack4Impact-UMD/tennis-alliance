import React, { useEffect, useRef, useState } from 'react';
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import DayGrid from '@event-calendar/day-grid';
import Interaction from '@event-calendar/interaction';
import TodayEvents from './today-events';
import { RegisteredEvents } from './registered-events';
import UpcomingEvents from './upcoming-events';
import { type CustomEvent, type User } from "@/types";
import styles from "@/styles/calendar-main.module.css";
import {fetchEvents, createUser, addUserToEvent, sendEmail, deleteUserFromEvent} from '@/backend/CloudFunctionsCalls';
import {adminGetEvents} from '@/backend/FirestoreCalls';
import '@event-calendar/core/index.css';
import { useAuth } from '@/auth/AuthProvider';
import { getUserWithId } from '@/backend/FirestoreCalls';
import DeletePopUp from '@/pages/admin-event-delete-popup';
import EditPopup from '@/pages/admin-event-edit-popup';
import Image from "next/image";
import TennisBalls from "@/assets/tennis_balls.png";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
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
  const [priorEvents, setPriorEvents] = useState<CustomEvent[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [displayedDate, setDisplayedDate] = useState<string>('');  // State for the displayed date
  const [registeredEvents, setRegisteredEvents] = useState<CustomEvent[]>([]);
  const [filteredRegisteredEvents, setFilteredRegisteredEvents] = useState<CustomEvent[]>([]);
  const [regUpcomingEvents, setRegUpcomingEvents] = useState<CustomEvent[]>([]);
  const [todayInEST, setTodayInEST] = useState<string>('');  // New state for today's date in EST
  const [isOutsideClick, setIsOutsideClick] = useState<boolean>(false);  // Flag for outside click
  const [outsideClickFlag, setOutsideClickFlag] = useState<boolean>(false);  // Flag for detecting clicks outside
  const registeredEventListRef = useRef<CustomEvent[]>([]); // Persistent across renders
  const todayEventsRef = useRef<HTMLDivElement | null>(null);
  const upcomingEventsRef = useRef<HTMLDivElement | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  const toggleRefresh = () => {
    setShouldRefresh((prev) => !prev);
  }


  const auth = useAuth();

  useEffect(() => {
    if (shouldRefresh) {
      const fetchAllEvents = async () => {
        if (!auth.loading) {
          const await_response = await fetchEvents(auth.user.uid);
          const combinedEvents = [...await_response[0], ...await_response[2]];
          setPriorEvents(await_response[0]);
          setEvents(combinedEvents);
          setUpcomingEvents(upcomingEvents);
          setRegUpcomingEvents(registeredEvents);
        }
      };
  
      fetchAllEvents();
    }
  }, [shouldRefresh]);
  
  useEffect(() => {
    const fetchAllEvents = async () => {
      if (!auth.loading) {
        const await_response = await fetchEvents(auth.user.uid);
        const combinedEvents = [...await_response[0], ...await_response[2]];
        setPriorEvents(await_response[0]);
        setEvents(combinedEvents);
        setUpcomingEvents(await_response[2]);
        setRegUpcomingEvents(await_response[1]);
        console.log("regUpcomingEvents: ", await_response[1]);
      }
    };

    fetchAllEvents();
  }, [auth.loading]);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.user) {
        const user = await getUserWithId(auth.user.uid);
        setUser(user);
      }
    };
    fetchUser();
  }, [auth.user]);

  /*useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        todayEventsRef.current &&
        !todayEventsRef.current.contains(event.target as Node) &&
        upcomingEventsRef.current &&
        !upcomingEventsRef.current.contains(event.target as Node)
      ) {
        console.log("clicked outside");
        resetToInitialState();
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetToInitialState = () => {
    setSelectedDate(null);
    setEventsForSelectedDate([]);
    setTodayEvents(events.filter(event => event.date === todayInEST));
    setUpcomingEvents(events.filter(event => new Date(event.date) >= new Date(todayInEST)));
    setDisplayedDate(todayInEST);
  };

  useEffect(() => {
    if (outsideClickFlag) {
      setSelectedDate(null);  // Reset selected date when clicking outside
      setEventsForSelectedDate([]);
      setDisplayedDate(todayInEST);  // Set displayed date back to today's date
      setOutsideClickFlag(false);  // Reset the flag after updating the state
    }
  }, [outsideClickFlag, todayInEST]);

  useEffect(() => {
    // Set the displayed date to today if the flag is true
    if (isOutsideClick) {
      const now = new Date();
      const utcOffset = now.getTimezoneOffset() * 60000;
      const estOffset = 5 * 60 * 60000;
      const estDate = new Date(now.getTime() - utcOffset + estOffset);

      const year = estDate.getFullYear();
      const month = String(estDate.getMonth() + 1).padStart(2, '0');
      const day = String(estDate.getDate()).padStart(2, '0');
      const todayInEST = `${year}-${month}-${day}`;
      
      setDisplayedDate(todayInEST);
      setIsOutsideClick(false); // Reset the flag
    }
  }, [isOutsideClick]);*/

  useEffect(() => {
    if (selectedDate) {
      const filteredEvents = regUpcomingEvents.filter(
        (event) => event.date === selectedDate
      );
      setFilteredRegisteredEvents(filteredEvents);
      setRegisteredEvents(filteredEvents);
    } else {
      setRegisteredEvents(registeredEventListRef.current);
    }
  }, [selectedDate, registeredEvents]);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarEvents: CustomEvent[] = [];
      const eventCountByDate: { [key: string]: number } = {};
      const eventsByDate: { [key: string]: CustomEvent[] } = {};

      const now = new Date();
      const utcOffset = now.getTimezoneOffset() * 60000;
      const estOffset = 5 * 60 * 60000;
      const estDate = new Date(now.getTime() - utcOffset + estOffset);

      const year = estDate.getFullYear();
      const month = String(estDate.getMonth() + 1).padStart(2, '0');
      const day = String(estDate.getDate()).padStart(2, '0');
      const todayInEST = `${year}-${month}-${day}`;

      setDisplayedDate(todayInEST);

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      const todayEventList: CustomEvent[] = [];
      const upcomingEventList: CustomEvent[] = [];
      const registeredEventList: CustomEvent[] = [];


      events.forEach(event => {
        const dateKey = event.date;
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

        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }

        if (event.id) {
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

        eventsByDate[dateKey].push(eventObj);

        if (dateKey === todayInEST) {
          todayEventList.push(eventObj);
        }

        const eventDate = new Date(dateKey);
        const todayDate = new Date(todayInEST);

        // Add events that are today or in the future
        if (eventDate >= todayDate && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
          upcomingEventList.push(eventObj);
        }

      });

      // Aggregate Registered Upcoming Events
      regUpcomingEvents.forEach(event => {
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
        registeredEventList.push(eventObj);
      });

      // Create aggregated events for the calendar
      
      Object.keys(eventCountByDate).forEach(date => {
        calendarEvents.push({
          id: date,
          title: `${eventCountByDate[date]} event${eventCountByDate[date] > 1 ? 's' : ''}`,
          start: `${date}T00:00`,
          end: `${date}T23:59`,
          description: 'temporary description',
          date: date,
          participants: [],
          maxParticipants: 0,
          maxVolunteers: 0,
        });
      });

      setTodayEvents(todayEventList);
      upcomingEventList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setUpcomingEvents(upcomingEventList);
      setCalendarEvents(calendarEvents);
      registeredEventList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      registeredEventListRef.current = registeredEventList;
      setRegisteredEvents(registeredEventList);
      console.log("registeredEventList: ", registeredEventList);

      const ec = new Calendar({
        target: calendarRef.current,
        props: {
          plugins: [TimeGrid, DayGrid, Interaction],
          options: {
            view: 'dayGridMonth',
            events: calendarEvents,
            eventContent: (info) => info.event.title,
            dateClick: (info) => {
              const clickedDate = info.date.toISOString().split('T')[0];
              console.log("clickedDate: ", clickedDate);
              setDisplayedDate(clickedDate);
              setSelectedDate(clickedDate);
              console.log("selectedDate: ", selectedDate);
              setEventsForSelectedDate(eventsByDate[clickedDate] || []);
            },
          },
        },
      });

      return () => {
        ec.destroy();
      };
    }
  }, [events, regUpcomingEvents, todayInEST]);

  useEffect(() => {
    setDisplayedDate(selectedDate || formatDate(new Date().toISOString().split('T')[0]));
  }, [selectedDate]);

  const handleRegisterEvent = (eventId: string) => {
    const newRegisteredEvent = upcomingEvents.find(event => event.id === eventId);
    if (newRegisteredEvent) {
      setRegisteredEvents((prevRegisteredEvents) => [
        ...prevRegisteredEvents,
        newRegisteredEvent,
      ]);
      setUpcomingEvents((prevUpcomingEvents) =>
        prevUpcomingEvents.filter(
          (event) => event.id !== newRegisteredEvent.id
        )
      );
      setTodayEvents((prevTodayEvents) =>
        prevTodayEvents.filter(
          (event) => event.id !== newRegisteredEvent.id
        )
      );
    }
  };

  return (
    <div className={styles.calendarBox}>
      <div className={styles.registeredContainer}>
        <div className={styles.eventRegisteredBox}>
          <p>Events Registered</p>
        </div>        
        {user && <RegisteredEvents events={registeredEvents} user={user} displayedDate={selectedDate ? selectedDate : displayedDate} />}
      </div>

      <div className={styles.eventNewBox}>
        <p>New Events:</p>
      </div>

      <div ref={calendarRef} className={styles.calendarDiv}></div>

      <div className={styles.todayContainer}>
        {(!selectedDate || selectedDate === todayInEST) && (
          <div className={styles.todayBox}> 
            <p>Today's Events</p>
          </div>
        )}
        {user && !selectedDate && (
          <TodayEvents 
            ref={todayEventsRef}
            events={todayEvents} 
            user={user}
            upcomingEvents={upcomingEvents}
            registeredEvents={registeredEvents}
            setUpcomingEvents={setUpcomingEvents}
            setRegisteredEvents={setRegisteredEvents}
            onRegisterEvent={handleRegisterEvent}
          />
        )}
      </div>

      <div className={styles.upcomingContainer}>
        <div className={styles.upcomingBox}>
          <p>Upcoming Events</p>
        </div>
        {user && (
          <UpcomingEvents
            ref={upcomingEventsRef}
            events={selectedDate ? eventsForSelectedDate : upcomingEvents}
            user={user}
            upcomingEvents={upcomingEvents}
            registeredEvents={registeredEvents}
            setUpcomingEvents={setUpcomingEvents}
            setRegisteredEvents={setRegisteredEvents}
            onRegisterEvent={handleRegisterEvent}
          />
        )}
      </div>
    </div>
  );
};

export default MyCalendar;