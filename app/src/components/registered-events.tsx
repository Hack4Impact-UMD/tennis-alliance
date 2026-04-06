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
  hasSelectedDate: boolean;
  user: User;
  onEventsChanged?: () => Promise<void>;
}

export const RegisteredEvents: React.FC<RegisteredEventsProp> = ({ events, user, displayedDate, hasSelectedDate, onEventsChanged }) => {
  const INITIAL_VISIBLE_EVENTS = 3;
  const VISIBLE_EVENTS_STEP = 3;
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [cancellingEventId, setCancellingEventId] = useState<string | null>(null);
  const [visibleEventCount, setVisibleEventCount] = useState(INITIAL_VISIBLE_EVENTS);
  const eventIdsKey = events.map((event) => event.id ?? "").join("|");
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

  const formatTimeRange = (startTimeString: string, endTimeString: string) => {
    const startTime = startTimeString.split("T")[1];
    const endTime = endTimeString.split("T")[1];
    return `${startTime} - ${endTime}`;
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
      return '#AACDEE'; // Blue for participant
    }
    return ''; // Default (no background color)
  };

  const getRoleCounts = (event: CustomEvent) => {
    return event.participants.reduce(
      (totals, participant) => {
        const memberCount = Array.isArray(participant.otherMembers)
          ? participant.otherMembers.length
          : 0;

        if (participant.role === "participant") {
          totals.participants += memberCount;
        } else if (participant.role === "volunteer") {
          totals.volunteers += memberCount;
        }

        return totals;
      },
      { participants: 0, volunteers: 0 }
    );
  };

  async function handleDeleteUser(auth_id: string, eventId: string) {
    setCancellingEventId(eventId);
    try {
      await deleteUserFromEvent(auth_id, eventId); // Wait for the delete function to complete
      if (onEventsChanged) {
        await onEventsChanged();
      }
    } catch (error) {
      console.error("Error deleting user from event:", error);
    } finally {
      setCancellingEventId(null);
    }
  }

  useEffect(() => {
    setVisibleEventCount(INITIAL_VISIBLE_EVENTS);
  }, [eventIdsKey]);

  const visibleEvents = events.slice(0, visibleEventCount);
  const hiddenEventCount = Math.max(0, events.length - visibleEventCount);
  const nextVisibleCount = Math.min(events.length, visibleEventCount + VISIBLE_EVENTS_STEP);
  const revealCount = nextVisibleCount - visibleEventCount;

  return (
    <div className={styles.registeredEventsContainer}>
      {events.length > 0 ? (
        visibleEvents.map(event => {
          const isExpanded = expandedEventId === event.id;
          const isCancelling = cancellingEventId === event.id;
          const roleCounts = getRoleCounts(event);
          const participantSlotsOpen = event.maxParticipants - roleCounts.participants;
          const volunteerSlotsOpen = event.maxVolunteers - roleCounts.volunteers;
          const isEventFull = participantSlotsOpen <= 0 && volunteerSlotsOpen <= 0;
          const eventDate = new Date(event.start);
          const eventDay = eventDate.getDate();
          const eventMonth = eventDate.toLocaleString("default", { month: "long" });
          const eventDayWithSuffix = `${eventDay}${getOrdinalSuffix(eventDay)}`;
          
          const regEvent = user.events.find(regEvent => regEvent.id === event.id);
          const participantNames = regEvent
            ? regEvent.participants.map(participant => `${participant.firstName} ${participant.lastName}`).join(", ")
            : "No participants found.";
          const registeredRole = regEvent?.role ?? null;
          const roleLabel =
            registeredRole === "participant"
              ? "Participant"
              : registeredRole === "volunteer"
                ? "Volunteer"
                : "Unknown";
          
          // console.log(event);
          return (
            <div key={event.id} className={styles.individualEvent} style={{ backgroundColor: getEventBackgroundColor(roleLabel) }}>
              <div className={styles.dateSection}>
                <p>{formatDate(event.date)}</p>
                <p>{roleLabel}</p>
              </div>

              {/* Divider line */}
              <div className={styles.divider}></div>

              <div className={styles.eventInformation}>
                <div className={styles.titleButtonContainer}>
                  <Image src={Racquet} alt="Racquet" className={styles.titleIcon} />
                  <div className={styles.titleStack}>
                    <p className={styles.titleText}>{event.title}</p>
                    {isEventFull && <span className={styles.statusBadge}>Full</span>}
                  </div>
                  <Image
                    className={styles.titleAction}
                    src={Arrow}
                    style={{
                      cursor: "pointer",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                    alt="Arrow"
                    onClick={() => setExpandedEventId(isExpanded ? null : event.id ?? null)}
                  />
                </div>    
                <div className={styles.eventDetails}>
                  <p className={styles.summaryRow}><span className={styles.summaryLabel}>Time:</span> <span className={styles.summaryValue}>{formatTimeRange(event.start, event.end)}</span></p>
                  <p className={styles.summaryRow}><span className={styles.summaryLabel}>Role:</span> <span className={styles.summaryValue}>{roleLabel}</span></p>
                  <p className={styles.summaryRow}><span className={styles.summaryLabel}>Registered:</span> <span className={styles.summaryValue}>{participantNames}</span></p>
                </div>
                {isExpanded && (
                  <div className={styles.expandedDetails}>
                    <p className={styles.descriptionText}><span className={styles.descriptionLabel}>Description:</span> {event.description}</p>
                    <p className={styles.summaryRow}><span className={styles.summaryLabel}>Participant spots:</span> <span className={styles.summaryValue}>{Math.max(0, participantSlotsOpen)} out of {event.maxParticipants}</span></p>
                    <p className={styles.summaryRow}><span className={styles.summaryLabel}>Volunteer spots:</span> <span className={styles.summaryValue}>{Math.max(0, volunteerSlotsOpen)} out of {event.maxVolunteers}</span></p>
                    <button
                        className={styles.removeButton}
                        disabled={isCancelling}
                        onClick={() => 
                        {
                          handleDeleteUser(user.auth_id as string, event.id as string);
                        }}
                    >
                        {isCancelling ? (
                          <span className={styles.buttonContent}>
                            <span className={styles.inlineSpinner} aria-hidden="true" />
                            Cancelling...
                          </span>
                        ) : (
                          "Remove"
                        )}
                    </button>
                  </div>
                )}
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
              <p>{hasSelectedDate ? `No registered events for ${formatDate(displayedDate)}` : "No events registered"}</p>
          </div>
        </div>
      )}
      {hiddenEventCount > 0 && (
        <button
          type="button"
          className={styles.showMoreButton}
          onClick={() => setVisibleEventCount(nextVisibleCount)}
        >
          Show {revealCount} more
        </button>
      )}
      {hiddenEventCount === 0 && events.length > INITIAL_VISIBLE_EVENTS && (
        <button
          type="button"
          className={styles.showMoreButton}
          onClick={() => setVisibleEventCount(INITIAL_VISIBLE_EVENTS)}
        >
          Show less
        </button>
      )}
    </div>
  );
};
