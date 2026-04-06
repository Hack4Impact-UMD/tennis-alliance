import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import DayGrid from '@event-calendar/day-grid';
import Interaction from '@event-calendar/interaction';
import TodayEvents from './today-events';
import { RegisteredEvents } from './registered-events';
import UpcomingEvents from './upcoming-events';
import { type CustomEvent, type User } from "@/types";
import styles from "@/styles/calendar-main.module.css";
import {fetchEvents} from '@/backend/CloudFunctionsCalls';
import '@event-calendar/core/index.css';
import { useAuth } from '@/auth/AuthProvider';
import { getUserWithId } from '@/backend/FirestoreCalls';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };

  return date.toLocaleDateString('en-US', options);
};

const formatMonthDay = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
};

const addDaysToDateString = (dateString: string, daysToAdd: number): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

const getTodayInESTDateString = (): string => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000;
  const estOffset = 5 * 60 * 60000;
  const estDate = new Date(now.getTime() - utcOffset + estOffset);

  const year = estDate.getFullYear();
  const month = String(estDate.getMonth() + 1).padStart(2, '0');
  const day = String(estDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const normalizeEventForDisplay = (event: CustomEvent): CustomEvent => ({
  ...event,
  start: event.start.includes('T') ? event.start : `${event.date}T${event.start}`,
  end: event.end.includes('T') ? event.end : `${event.date}T${event.end}`,
});

const MyCalendar: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarViewDate, setCalendarViewDate] = useState<string>('');
  const [todayEvents, setTodayEvents] = useState<CustomEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CustomEvent[]>([]);
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [displayedDate, setDisplayedDate] = useState<string>('');  // State for the displayed date
  const [regUpcomingEvents, setRegUpcomingEvents] = useState<CustomEvent[]>([]);
  const [todayInEST, setTodayInEST] = useState<string>('');  // New state for today's date in EST
  const todayEventsRef = useRef<HTMLDivElement | null>(null);
  const upcomingEventsRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const noopEventStateSetter: React.Dispatch<React.SetStateAction<CustomEvent[]>> = () => undefined;


  const auth = useAuth();

  const refreshCalendarData = useCallback(async () => {
    if (auth.loading || !auth.user?.uid) {
      return;
    }

    setIsLoadingEvents(true);
    try {
      const [priorEventsData, registeredUpcomingData, upcomingEventsData] = await fetchEvents(auth.user.uid);
      const combinedEvents = [...priorEventsData, ...upcomingEventsData];
      const refreshedUser = await getUserWithId(auth.user.uid);

      setEvents(combinedEvents);
      setRegUpcomingEvents(registeredUpcomingData);
      setUser(refreshedUser);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [auth.loading, auth.user?.uid]);
  
  useEffect(() => {
    refreshCalendarData();
  }, [refreshCalendarData]);

  const allRegisteredEvents = useMemo(() => {
    return regUpcomingEvents
      .map(normalizeEventForDisplay)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [regUpcomingEvents]);

  const registeredEvents = useMemo(() => {
    if (!selectedDate) {
      return allRegisteredEvents;
    }

    return allRegisteredEvents.filter((event) => event.date === selectedDate);
  }, [allRegisteredEvents, selectedDate]);

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate || selectedDate < todayInEST) {
      return [];
    }

    const registeredEventIds = new Set(
      registeredEvents
        .map((event) => event.id)
        .filter((eventId): eventId is string => Boolean(eventId))
    );

    return events
      .filter((event) => event.date === selectedDate)
      .filter((event) => !event.id || !registeredEventIds.has(event.id))
      .map(normalizeEventForDisplay);
  }, [events, registeredEvents, selectedDate, todayInEST]);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarEvents: CustomEvent[] = [];
      const eventCountByDate: { [key: string]: number } = {};

      const todayInEST = getTodayInESTDateString();
      const upcomingWindowEnd = addDaysToDateString(todayInEST, 31);

      setTodayInEST(todayInEST);
      setDisplayedDate(todayInEST);

      const todayEventList: CustomEvent[] = [];
      const upcomingEventList: CustomEvent[] = [];
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

        if (event.id) {
          eventObj = normalizeEventForDisplay(event);
        }

        if (dateKey === todayInEST) {
          todayEventList.push(eventObj);
        }
        if (dateKey > todayInEST && dateKey <= upcomingWindowEnd) {
          upcomingEventList.push(eventObj);
        }

      });

      // Aggregate Registered Upcoming Events
      regUpcomingEvents.forEach(event => {
        const dateKey = event.date; // Get the date (YYYY-MM-DD)
        eventCountByDate[dateKey] = (eventCountByDate[dateKey] || 0) + 1;
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

      const ec = new Calendar({
        target: calendarRef.current,
        props: {
          plugins: [TimeGrid, DayGrid, Interaction],
          options: {
            view: 'dayGridMonth',
            date: new Date(`${calendarViewDate || todayInEST}T00:00:00`),
            events: calendarEvents,
            highlightedDates: selectedDate ? [selectedDate] : [],
            eventContent: (info) => info.event.title,
            dateClick: (info) => {
              const clickedDate = info.date.toISOString().split('T')[0];
              const nextSelectedDate = selectedDate === clickedDate ? null : clickedDate;

              setCalendarViewDate(clickedDate);
              setSelectedDate(nextSelectedDate);
              setDisplayedDate(nextSelectedDate ? clickedDate : formatDate(new Date().toISOString().split('T')[0]));
            },
            eventClick: (info) => {
              const clickedDate = info.event.start.toISOString().split('T')[0];
              const nextSelectedDate = selectedDate === clickedDate ? null : clickedDate;

              setCalendarViewDate(clickedDate);
              setSelectedDate(nextSelectedDate);
              setDisplayedDate(nextSelectedDate ? clickedDate : formatDate(new Date().toISOString().split('T')[0]));
            },
          },
        },
      });

      return () => {
        ec.destroy();
      };
    }
  }, [calendarViewDate, events, regUpcomingEvents, selectedDate, todayInEST]);

  useEffect(() => {
    setDisplayedDate(selectedDate || formatDate(new Date().toISOString().split('T')[0]));
  }, [selectedDate]);

  return (
    <div className={styles.calendarBox}>
      {isLoadingEvents ? (
        <div className={styles.loadingState}>
          <div className={styles.inlineSpinner} aria-hidden="true" />
          <p>Loading events...</p>
        </div>
      ) : (
        <>
      <div className={styles.registeredContainer}>
        <div className={styles.eventRegisteredBox}>
          <p>{selectedDate ? `Your Events On ${formatMonthDay(selectedDate)}` : "Registered Events"}</p>
        </div>        
        {user && <RegisteredEvents events={registeredEvents} user={user} displayedDate={selectedDate ? selectedDate : displayedDate} hasSelectedDate={Boolean(selectedDate)} onEventsChanged={refreshCalendarData} />}
      </div>

      <div className={styles.eventNewBox}>
        <p>Calendar</p>
      </div>

      <div ref={calendarRef} className={styles.calendarDiv}></div>

      <div className={styles.todayContainer}>
        {!selectedDate && (
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
            setRegisteredEvents={noopEventStateSetter}
            onRegisterEvent={refreshCalendarData}
          />
        )}
      </div>

      <div className={styles.upcomingContainer}>
        <div className={styles.upcomingBox}>
          <p>{selectedDate ? `Available Events On ${formatMonthDay(selectedDate)}` : "Upcoming Events"}</p>
        </div>
        {user && (
          <UpcomingEvents
            ref={upcomingEventsRef}
            events={selectedDate ? eventsForSelectedDate : upcomingEvents}
            user={user}
            upcomingEvents={upcomingEvents}
            registeredEvents={registeredEvents}
            setUpcomingEvents={setUpcomingEvents}
            setRegisteredEvents={noopEventStateSetter}
            onRegisterEvent={refreshCalendarData}
            emptyMessage={selectedDate ? "No available events for this date" : "No unregistered events upcoming."}
          />
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default MyCalendar;
