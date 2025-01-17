import React, { useState, useEffect } from "react";
import { type CustomEvent, type User } from "@/types";
import { deleteUserFromEvent } from "@/backend/CloudFunctionsCalls";
import Arrow from "@/assets/down_arrow.png";
import Racquet from "@/assets/tennis_racquet.png";
import Image from "next/image";import TennisBalls from "@/assets/tennis_balls.png";
import styles from "@/styles/registered-events.module.css";

interface RegisteredEventsProp {
  events: CustomEvent[];
  displayedDate: string;
  user: User;
}

export const RegisteredEvents: React.FC<RegisteredEventsProp> = ({ events, user, displayedDate }) => {
  // console.log(user.auth_id);
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

  const getEventBackgroundColor = (role: string) => {
    if (role === 'Volunteer') {
      return '#FCF7CE'; // Yellow for volunteer
    } else if (role === 'Participant') {
      return '#E4F5E2'; // Light green for participant
    }
    return ''; // Default (no background color)
  };

  async function handleDeleteUser(auth_id: string, eventId: string) {
    try {
      await deleteUserFromEvent(auth_id, eventId); // Wait for the delete function to complete
      window.location.reload(); // Reload the page after successful deletion
    } catch (error) {
      console.error("Error deleting user from event:", error);
    }
  }

  return (
    <div className={styles.registeredEventsContainer}>
      {events.length > 0 ? (
        events.map(event => {
          let totalOtherMembers = 0;
          event.participants.forEach(participant => {
              totalOtherMembers += participant.otherMembers.length;
          });
          const slotsOpen = event.maxParticipants - totalOtherMembers;
          const eventDate = new Date(event.start);
          const eventDay = eventDate.getDate();
          const eventMonth = eventDate.toLocaleString("default", { month: "long" });
          const eventDayWithSuffix = `${eventDay}${getOrdinalSuffix(eventDay)}`;
          
          const regEvent = user.events.find(regEvent => regEvent.id === event.id);
          const participantNames = regEvent
            ? regEvent.participants.map(participant => `${participant.firstName} ${participant.lastName}`).join(", ")
            : "No participants found.";
          
          console.log(event);
          return (
            <div key={event.id} className={styles.individualEvent} style={{ backgroundColor: getEventBackgroundColor("Participant") }}>
              <div className={styles.dateSection}>
                <p>{formatDate(event.date)}</p>
                {/* <p>Volunteer</p> */}
              </div>

              {/* Divider line */}
              <div className={styles.divider}></div>

              <div className={styles.eventInformation}>
                <div className={styles.titleButtonContainer}>
                  <Image src={Racquet} alt="Racquet" />
                  <p style={{ display: 'inline' }}>{event.title}</p>
                  {/* Square button next to event title */}
                  <Image src = {Arrow} alt = "Arrow"/> 
                </div>    
                {/* Center-aligned details */}
                <div className={styles.eventDetails}>
                  <p>Time: {formatTime(event.start)}</p>
                  <p>Registered: {participantNames}</p>
                  <br />
                  <p>Slots open: {slotsOpen} out of {event.maxParticipants}</p>
                  <button className={styles.removeButton} onClick={() => 
                      {
                        // console.log("Payload: ", user.auth_id as string, " ",  event.id as string)
                        handleDeleteUser(user.auth_id as string, event.id as string);
                      }}>
                      Remove
                  </button>
                </div>
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