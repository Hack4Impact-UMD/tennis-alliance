import React, { useEffect } from 'react';
import styles from "@/styles/dashboard-events.module.css";
import { type CustomEvent, type User } from "@/types";
import Racquet from "@/assets/tennis_racquet.png";
import Image from "next/image";
import {addUserToEvent} from '@/backend/CloudFunctionsCalls';
import { event } from '@/tests/mock';
import EditPopup from '@/pages/admin-event-edit-popup';
import DeletePopUp from '@/pages/admin-event-delete-popup';



interface CalendarEvent {
 id: string;
 title: string;
 start: string; // ISO 8601 string or other compatible date format
 end: string;
 description: string;
}


interface DashboardEventsProp {
 events: CustomEvent[];
 onSelectEvent?: (event: CustomEvent) => Promise<void>;
}


const DashboardEvents: React.FC<DashboardEventsProp> = ({ events, onSelectEvent }) => {


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
  
    // Convert month to a string using the Date object
    const monthName = new Date(parseInt(year, 10), month).toLocaleString('default', { month: 'long' });
    
    return `${monthName} ${day}${getOrdinalSuffix(day)}`;
  };


 // Get today's date
 const today = new Date();
 const day = today.getDate();
 const month = today.toLocaleString('default', { month: 'long' }); // Full month name
 const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;



 return (
   <div className={styles.dashboardEventsContainer}>
     {events.length > 0 ? (
       events.map(event => (
        <div key={event.id} onClick={() => onSelectEvent && onSelectEvent(event)} className={styles.individualEvent} style={{ backgroundColor: getEventBackgroundColor("Participant") }}>
           <div className={styles.dateSection}>
             <p>{formatDate(event.start)}</p> 
             <p>Participant</p>
           </div>


           {/* Divider line */}
           <div className={styles.divider}></div>


           <div className={styles.eventInformation}>
            <div className={styles.editDeleteContainer}>
              <EditPopup eventID={event.id}/>
              <DeletePopUp eventID={event.id}/>
            </div>
             <div className={styles.titleButtonContainer}>
                 <Image src={Racquet} alt="Racquet" />
                 <p style={{ fontSize: '1.50rem'}}>{event.title}</p>
             </div>   
             {/* Center-aligned details */}
             <div className={styles.eventDetails}>
               <p>Time: {formatTime(event.start)}</p>
               <p>{event.description}</p>
               <p>Slots open: {event.maxParticipants - event.participants.length} out of {event.maxParticipants}</p>
             </div>
           </div>
         </div>
       ))
     ) : (
       <p>No events today.</p>
     )}
   </div>
 );
};


export default DashboardEvents;