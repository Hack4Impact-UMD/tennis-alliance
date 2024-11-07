import React from "react";
import styles from "@/styles/today-events.module.css";

interface CalendarEvent {
    id: string;
    title: string;
    start: string; // ISO 8601 string or other compatible date format
    end: string;
    description: string;
}

interface RegisteredEventsProp {
    events: CustomEvent[];
}

export const RegisteredEvents: React.FC<RegisteredEventsProp> = ({ events }) => {
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

  const formatTime = (timeString: string) => {
    const getTime = timeString.split('T')[1];
    return getTime;
  };

  // Function to convert the event's start time to EST and format it
  const formatDate = (timeString: string) => {
    const getDate = timeString.split('T')[0];
    const year = getDate.split('-')[0];
    const month = parseInt(getDate.split('-')[1], 10) - 1; // Convert to zero-based index for Date object
    const day = parseInt(getDate.split('-')[2], 10);
  
    // Convert month to a string using the Date object
    const monthName = new Date(parseInt(year, 10), month).toLocaleString('default', { month: 'long' });
    
    return `${monthName} ${day}${getOrdinalSuffix(day)}`;
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
                <p>{formatDate(event.start)}</p> {/* Display event's date */}
                <p>Volunteer</p>
              </div>
              <div className={styles.eventInformation}>
                <h3>{event.title}</h3>
                <p>Time: {formatTime(event.start)}</p> {/* Convert and display time in EST */}
                <p>Slots open: 7 out of 20</p> {/* This should also be dynamic */}
              </div>
            </div>
          );
        })
      ) : (
        <p>No registered events.</p>
      )}
    </div>
  );
};
