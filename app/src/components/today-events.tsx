import React from 'react';
import styles from "@/styles/today-events.module.css";
import { type CustomEvent } from "@/types";
import Racquet from "@/assets/tennis_racquet.png";
import Image from "next/image";


interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO 8601 string or other compatible date format
  end: string;
  description: string;
}

interface TodayEventsProps {
  events: CustomEvent[];
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

const formatTime = (timeString: string) => {
  const getTime = timeString.split('T')[1];
  return getTime;
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
              <p>Today's Events</p>
              <p>{`${month} ${dayWithSuffix}`}</p> {/* Display today's date */}
            </div>

            {/* Divider line */}
            <div className={styles.divider}></div>

            <div className={styles.eventInformation}>
              <div className={styles.titleButtonContainer}>
                  <Image src={Racquet} alt="Racquet" />
                  <p style={{ fontSize: '1.50rem'}}>{event.title}</p>
              </div>    
              <p>Time: {formatTime(event.start)}</p> {/* Convert and display time in EST */}
              <p>{event.description}</p>
              <p>Slots open: {event.participants.length} out of {event.maxParticipants}</p> {/* This should also be dynamic */}
              <div className={styles.buttonGroup}>
                {/* Show "Register" and "Cancel" buttons only if the event is not expanded */}
                {expandedEventId !== event.id && (
                  <>
                    <button 
                      className={styles.registerBtn}
                      onClick={() => setExpandedEventId(event.id ?? null)}
                    >
                      Register
                    </button>
                    <button className={styles.cancelBtn}>Cancel</button>
                  </>
                )}
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
