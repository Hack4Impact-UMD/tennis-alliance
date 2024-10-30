import React from 'react';
import styles from "@/styles/today-events.module.css";
import { type CustomEvent } from "@/types";

interface UpcomingEventsProps {
  events: CustomEvent[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
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
                <div className={styles.titleButtonContainer}>
                  <h3 style={{ display: 'inline' }}>{event.title}</h3>
                  {/* Square button next to event title */}
                  <button 
                    className={styles.toggleButton}
                    onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id as string | null)}
                  >
                  ▼
                  </button>
                </div>                
                <p>Time: {event.start}</p> {/* Convert and display time in EST */}
                <p>Slots open: 7 out of 20</p> {/* This should also be dynamic */}
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
          );
        })
      ) : (
        <p>No events upcoming.</p>
      )}
    </div>
  );
};

export default UpcomingEvents;
