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

  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);

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

  // Get today's date
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' }); // Full month name
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  return (
    <div className={styles.todayEventsContainer}>
      {events.length > 0 ? (
        events.map(event => (
          <div key={event.id} className={styles.individualEvent}>
            <div className={styles.dateSection}>
              <h2>Today's Events</h2>
              <p>{`${month} ${dayWithSuffix}`}</p> {/* Display today's date */}
            </div>
            <div className={styles.eventInformation}>
              <h3>{event.title}</h3>
              <p>Time: {formatTimeToEST(event.start)}</p> {/* Convert and display time in EST */}
              <p>{event.description}</p>
              <p>Slots open: 7 out of 20</p> {/* This should also be dynamic */}
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.registerBtn}
                  onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                >                  
                {expandedEventId === event.id ? "Hide Details" : "Register"}
                </button>
                <button className={styles.cancelBtn}>Cancel</button>
              </div>
              {expandedEventId === event.id && (
                <div className={styles.registrationForm}>
                  <p>Would you like to register as a participant or volunteer?</p>
                  <div className={styles.radioButtonRow}>
                  <label>
                    <input type="radio" name="role" value="participant" />
                      Participant
                  </label>
                  <label>
                    <input type="radio" name="role" value="volunteer" />
                      Volunteer
                  </label>
                </div>
                <p>Please select the names of the people in your group who will be participating:</p>
                <div className={styles.checkboxGroup}>
                  {/*{participants.map((name, index) => (
                    <label key={index}>
                      <input type="checkbox" name={`participant-${index}`} />
                      {name}
                    </label>
                  ))}*/}
                  <label>
                    <input type = "checkbox" name = "participant-1" />
                    John Doe
                  </label>
                  <label>
                    <input type = "checkbox" name = "participant-2" />
                    Jane Doe
                  </label>
                  <label>
                    <input type = "checkbox" name = "participant-3" />
                    Alex Smith
                  </label>
                </div>
                <div className = {styles.buttonWrapper}>
                  <button className={styles.submitBtn}>Submit</button>
                </div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No events today.</p>
      )}
    </div>
  );
};

export default TodayEvents;
