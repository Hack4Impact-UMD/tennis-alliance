import React from "react";
import Image from "next/image";
import TennisBalls from "@/assets/tennis_balls.png";import styles from "@/styles/registered-events.module.css";
import { type CustomEvent } from "@/types";

interface RegisteredEventsProp {
  events: CustomEvent[];
  displayedDate: string;
}

export const RegisteredEvents: React.FC<RegisteredEventsProp> = ({ events, displayedDate }) => {
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const formatTime = (timeString: string) => {
    const getTime = timeString.split("T")[1];
    return getTime;
  };

  const formatDate = (timeString: string) => {
    const getDate = timeString.split("T")[0];
    const year = getDate.split("-")[0];
    const month = parseInt(getDate.split("-")[1], 10) - 1;
    const day = parseInt(getDate.split("-")[2], 10);

    const monthName = new Date(parseInt(year, 10), month).toLocaleString("default", { month: "long" });
    return `${monthName} ${day}${getOrdinalSuffix(day)}`;
  };

  return (
    <div className={styles.todayEventsContainer}>
      {events.length > 0 ? (
        events.map(event => {
          const eventDate = new Date(event.start);
          const eventDay = eventDate.getDate();
          const eventMonth = eventDate.toLocaleString("default", { month: "long" });
          const eventDayWithSuffix = `${eventDay}${getOrdinalSuffix(eventDay)}`;

          return (
            <div key={event.id} className={styles.individualEvent}>
              <div className={styles.dateSection}>
                <p>{formatDate(event.start)}</p>
                <p>Volunteer</p>
              </div>
              <div className={styles.eventInformation}>
                <h3>{event.title}</h3>
                <p>Time: {formatTime(event.start)}</p>
                <p>Slots open: {event.maxParticipants - event.participants.length} out of {event.maxParticipants}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div className={styles.noEventsContainer}>
          <div className={styles.iconContainer}>
            <Image src={TennisBalls} alt="LogoIcon" width={50} height={50} style={{ borderRadius: "50%" }} />
          </div>
          <div className={styles.noEventsText}>
              <p>Nothing planned for {formatDate(displayedDate)}</p>
          </div>
        </div>
      )}
    </div>
  );
};