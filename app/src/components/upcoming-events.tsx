import React from 'react';
import styles from "@/styles/today-events.module.css";

interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO 8601 string or other compatible date format
  end: string;
  description: string;
}

interface TodayEventsProps {
  events: CalendarEvent[];
}

const TodayEvents: React.FC<TodayEventsProps> = ({ events }) => {
  // Function to get the correct ordinal suffix for the day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'; // Special case for numbers 11-20
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Function to convert the event's start time to EST and format it
  const formatTimeToEST = (dateString: string) => {
    const date = new Date(dateString);
    
    // Convert the time to EST (America/New_York timezone)
    const estTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'America/New_York', // EST timezone
    }).format(date);

    return estTime;
  };

  return (
    <div className={styles.todayEventsContainer}>
      {events.length > 0 ? (
        events.map(event => {
          // Extract the date from the event's start time
          const eventDate = new Date(event.start);
          const eventDay = eventDate.getDate();
          const eventMonth = eventDate.toLocaleString('default', { month: 'long' });
          const eventDayWithSuffix = `${eventDay}${getOrdinalSuffix(eventDay)}`;

          return (
            <div key={event.id} className={styles.individualEvent}>
              <div className={styles.dateSection}>
                <p>{`${eventMonth} ${eventDayWithSuffix}`}</p> {/* Display event's date */}
                <p>Volunteer</p>
              </div>
              <div className={styles.eventInformation}>
                <h3>{event.title}</h3>
                <p>Time: {formatTimeToEST(event.start)}</p> {/* Convert and display time in EST */}
                <p>Slots open: 7 out of 20</p> {/* This should also be dynamic */}
              </div>
            </div>
          );
        })
      ) : (
        <p>No events upcoming.</p>
      )}
    </div>
  );
};

export default TodayEvents;
