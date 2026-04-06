import React from 'react';
import styles from "@/styles/dashboard-events.module.css";
import { type CustomEvent } from "@/types";
import Racquet from "@/assets/tennis_racquet.png";
import Image from "next/image";
import EditPopup from '@/pages/admin-event-edit-popup';
import DeletePopUp from '@/pages/admin-event-delete-popup';

interface DashboardEventsProp {
  events: CustomEvent[];
  onSelectEvent?: (event: CustomEvent) => Promise<void>;
  onEventUpdated?: () => Promise<void>;
  onEventDeleted?: () => Promise<void>;
  emptyMessage?: string | null;
}

const DashboardEvents: React.FC<DashboardEventsProp> = ({ events, onSelectEvent, onEventUpdated, onEventDeleted, emptyMessage = "No events today." }) => {
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

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'; // Special case for numbers 11-20
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatTimeRange = (startTimeString: string, endTimeString: string) => {
    const startTime = startTimeString.split('T')[1];
    const endTime = endTimeString.split('T')[1];
    return `${startTime} - ${endTime}`;
  };

  const getEventBackgroundColor = (role: string) => {
    if (role === 'Volunteer') {
      return '#FCF7CE'; // Yellow for volunteer
    } else if (role === 'Participant') {
      return '#E4F5E2'; // Light green for participant
    }
    return ''; // Default (no background color)
  };

  const formatDate = (timeString: string) => {
    const getDate = timeString.split('T')[0];
    const year = getDate.split('-')[0];
    const month = parseInt(getDate.split('-')[1], 10) - 1; // Convert to zero-based index for Date object
    const day = parseInt(getDate.split('-')[2], 10);

    const monthName = new Date(parseInt(year, 10), month).toLocaleString('default', { month: 'long' });

    return `${monthName} ${day}${getOrdinalSuffix(day)}`;
  };

  return (
    <div className={styles.dashboardEventsContainer}>
      {events.length > 0 ? (
        events.map(event => {
          const eventID = event.id || "";
          const roleCounts = getRoleCounts(event);
          const participantSlotsOpen = event.maxParticipants - roleCounts.participants;
          const volunteerSlotsOpen = event.maxVolunteers - roleCounts.volunteers;
          const isEventFull = participantSlotsOpen <= 0 && volunteerSlotsOpen <= 0;
          return (
            <div key={event.id} onClick={() => onSelectEvent && onSelectEvent(event)} className={styles.individualEvent} style={{ backgroundColor: getEventBackgroundColor("Participant") }}>
              <div className={styles.dateSection}>
                <p>{formatDate(event.start)}</p>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.eventInformation}>
                <div className={styles.titleButtonContainer}>
                  <Image src={Racquet} alt="Racquet" className={styles.titleIcon} />
                  <div className={styles.titleStack}>
                    <p style={{ fontSize: '1.50rem' }}>{event.title}</p>
                    {isEventFull && <span className={styles.statusBadge}>Full</span>}
                  </div>
                </div>
                <div className={styles.eventDetails}>
                  <p>Time: {formatTimeRange(event.start, event.end)}</p>
                  <p>{event.description}</p>
                  <p>Participant spots: {Math.max(0, participantSlotsOpen)} out of {event.maxParticipants}</p>
                  <p>Volunteer spots: {Math.max(0, volunteerSlotsOpen)} out of {event.maxVolunteers}</p>
                </div>
                <div className={styles.editDeleteContainer}>
                  <EditPopup eventID={eventID} onEventUpdated={onEventUpdated} />
                  <DeletePopUp eventID={eventID} onEventDeleted={onEventDeleted} />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        emptyMessage ? <p className={styles.emptyState}>{emptyMessage}</p> : null
      )}
    </div>
  );
};

export default DashboardEvents;
