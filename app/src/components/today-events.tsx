import React, {forwardRef} from 'react';
import styles from "@/styles/today-events.module.css";
import { type CustomEvent, type User } from "@/types";
import Racquet from "@/assets/tennis_racquet.png";
import Image from "next/image";
import {addUserToEvent} from '@/backend/CloudFunctionsCalls';
import { event } from '@/tests/mock';




interface CalendarEvent {
 id: string;
 title: string;
 start: string; // ISO 8601 string or other compatible date format
 end: string;
 description: string;
}


interface TodayEventsProps {
 events: CustomEvent[];
 user: User;
 upcomingEvents: CustomEvent[];
 registeredEvents: CustomEvent[];
 setUpcomingEvents: React.Dispatch<React.SetStateAction<CustomEvent[]>>;
 setRegisteredEvents: React.Dispatch<React.SetStateAction<CustomEvent[]>>;
 onRegisterEvent: (eventId: string) => void;
}


const TodayEvents = forwardRef<HTMLDivElement, TodayEventsProps> (({ 
  events, 
  user,
  upcomingEvents,
  registeredEvents,
  setUpcomingEvents,
  setRegisteredEvents,
  onRegisterEvent}, ref) => {


 const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);
 const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
 const [role, setRole] = React.useState<string>("participant");




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


 const handleSubmit = async (eventId: string | undefined) => {
   if (!user.auth_id) {
     alert("User authentication ID is missing.");
     return;
   }
   if (!eventId) {
     alert("Event ID is missing.");
     return;
   }
   console.log("user auth id: ", user.auth_id);
   console.log("event id: ", eventId);
   console.log("members: ", selectedMembers.map(member => {
     const [firstName, lastName] = member.split(' ');
     return { firstName, lastName };
   }));
   try {
     await addUserToEvent(
       user.auth_id,
       eventId,
       selectedMembers.map(member => {
         const [firstName, lastName] = member.split(' ');
         return { firstName, lastName };
       })
     );
     /*onRegisterEvent(eventId);*/
     alert("You have successfully registered for the event!");
     window.location.reload();

     const eventToRegister = upcomingEvents.find((event) => event.id === eventId);
     if(eventToRegister) {
        setUpcomingEvents((prev) => prev.filter((event) => event.id !== eventId));
        setRegisteredEvents((prev) => [...prev, eventToRegister]);
     }
     
     setExpandedEventId(null);
     setSelectedMembers([]);
   } catch (error) {
     console.error("Error registering for event:", error);
     alert("There was an error. Please try again.");
   }
 };


 const handleCheckboxChange = (memberName: string) => {
   setSelectedMembers(prev =>
     prev.includes(memberName) ? prev.filter(name => name !== memberName) : [...prev, memberName]
   );
 };


 return (
   <div ref = {ref} className={styles.todayEventsContainer}>
     {events.length > 0 ? (
       events.map(event => {
        const availableSlots = event.maxParticipants - event.participants.length;
        const isEventFull = availableSlots <= 0;
        let totalOtherMembers = 0;
        event.participants.forEach(participant => {
          totalOtherMembers += participant.otherMembers.length;
        });
        const slotsOpen = event.maxParticipants - totalOtherMembers;

        return (

         <div key={event.id} className={styles.individualEvent}>
           <div className={styles.dateSection}>
             {/*<p>Today's Events</p>*/}
             <p>{`${month} ${dayWithSuffix}`}</p> {/* Display today's date */}
           </div>


           {/* Divider line */}
           <div className={styles.divider}></div>


           <div className={styles.eventInformation}>
             <div className={styles.titleButtonContainer}>
                 <Image className={styles.racquet} src={Racquet} alt="Racquet" />
                 <p className={styles.eventTitle} style={{ fontSize: '1.25rem'}}>{event.title}</p>
             </div>   
             {/* Center-aligned details */}
             <div className={styles.eventDetails}>
               <p>Time: {formatTime(event.start)}</p>
               <p>{event.description}</p>
               <p>Slots open: {slotsOpen} out of {event.maxParticipants}</p>
             </div>
             <div className={styles.buttonGroup}>
               {/* Show "Register" and "Cancel" buttons only if the event is not expanded */}
               {expandedEventId !== event.id && !isEventFull && (
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
                   <input
                   type="radio"
                   name="role"
                   value="participant"
                   checked={role === "participant"}
                   onChange={() => setRole("participant")}
                   />
                     Participant
                 </label>
                 <label>
                   <input
                   type="radio"
                   name="role"
                   value="volunteer"
                   checked={role === "volunteer"}
                   onChange={() => setRole("volunteer")}
                   />
                     Volunteer
                 </label>
               </div>
               <p>Please select the names of the people in your group who will be participating:</p>
               <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    name="participant-main"
                    checked={selectedMembers.includes(`${user.firstName} ${user.lastName}`)}
                    onChange={() => handleCheckboxChange(`${user.firstName} ${user.lastName}`)}
                  />
                  {user.firstName} {user.lastName}
                </label>
                 {/* Dynamic generation of family member checkboxes */}
                   {user.adults?.map((adult, index) => (
                     <label key={`adult-${index}`}>
                       <input
                         type="checkbox"
                         name={`participant-adult-${index}`}
                         checked={selectedMembers.includes(adult.name)}
                         onChange={() => handleCheckboxChange(adult.name)} />
                       {adult.name}
                     </label>
                   ))}
                   {user.children?.map((child, index) => (
                     <label key={`child-${index}`}>
                       <input
                         type="checkbox"
                         name={`participant-child-${index}`}
                         checked={selectedMembers.includes(`${child.firstName} ${child.lastName}`)}
                         onChange={() => handleCheckboxChange(`${child.firstName} ${child.lastName}`)}/>
                       {child.firstName} {child.lastName}
                     </label>
                   ))}
               </div>
               <div className = {styles.buttonWrapper}>
                 <button
                   className={styles.submitBtn}
                   disabled = {selectedMembers.length === 0}
                   onClick={() =>
                     {
                       handleSubmit(event.id)
                     }}
                 >
                   Submit
                 </button>
               </div>
               </div>
             )}
           </div>
         </div>
        );
      })
     ) : (
       <p>No events today.</p>
     )}
   </div>
 );
}
);


export default TodayEvents;