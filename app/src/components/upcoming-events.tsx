import React, {forwardRef} from 'react';
import styles from "@/styles/upcoming-events.module.css";
import { type CustomEvent, type User} from "@/types";
import Arrow from "@/assets/down_arrow.png";
import Racquet from "@/assets/tennis_racquet.png";
import {addUserToEvent} from '@/backend/CloudFunctionsCalls';
import Image from "next/image";

interface UpcomingEventsProps {
  events: CustomEvent[];
  user: User;
  upcomingEvents: CustomEvent[];
  registeredEvents: CustomEvent[];
  setUpcomingEvents: React.Dispatch<React.SetStateAction<CustomEvent[]>>;
  setRegisteredEvents: React.Dispatch<React.SetStateAction<CustomEvent[]>>;
  onRegisterEvent: (eventId: string) => void;
}

const UpcomingEvents = forwardRef<HTMLDivElement, UpcomingEventsProps> (({ 
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

  /*const formatDate = (timeString: string) => {
    const getDate = timeString.split('T')[0];
    const getMonth = getDate.split('-')[1];

    const getDay = getDate.split('-')[2];
    return `${getMonth} ${getDay} ${getOrdinalSuffix(parseInt(getDay, 10))}`;
  }*/

  const formatDate = (timeString: string) => {
    const getDate = timeString.split('T')[0];
    const year = getDate.split('-')[0];
    const month = parseInt(getDate.split('-')[1], 10) - 1; // Convert to zero-based index for Date object
    const day = parseInt(getDate.split('-')[2], 10);
  
    // Convert month to a string using the Date object
    const monthName = new Date(parseInt(year, 10), month).toLocaleString('default', { month: 'long' });
    
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

  const handleSubmit = async (eventId: string | undefined) => {
    if (!user.auth_id) {
      alert("User authentication ID is missing.");
      return;
    }
    if (!eventId) {
      alert("Event ID is missing.");
      return;
    }
    /*console.log("user auth id: ", user.auth_id);
    console.log("event id: ", eventId);
    console.log("members: ", selectedMembers.map(member => {
      const [firstName, lastName] = member.split(' ');
      return { firstName, lastName };
    }));*/
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
    <div ref = {ref} className={styles.upcomingEventContainer}>
      {events.length > 0 ? (
        events.map(event => {
          const availableSlots = (event.maxParticipants + event.maxVolunteers) - event.participants.length;
          const isEventFull = availableSlots <= 0;
          let totalOtherMembers = 0;
          event.participants.forEach(participant => {
            totalOtherMembers += participant.otherMembers.length;
          });
          const slotsOpen = event.maxParticipants - totalOtherMembers;
          // Extract the date from the event's start time
          const eventDate = new Date(event.start);
          const eventDay = eventDate.getDate();
          const eventMonth = eventDate.toLocaleString('default', { month: 'long' });
          const eventDayWithSuffix = `${eventDay}${getOrdinalSuffix(eventDay)}`;

          return (
            <div key={event.id} className={styles.individualEvent} style={{ backgroundColor: getEventBackgroundColor("Participant") }}>
              <div className={styles.dateSection}>
                <p>{formatDate(event.start)}</p> {/* Display event's date */}
                {/* <p>Participant</p> */}
              </div>

              {/* Divider line */}
              <div className={styles.divider}></div>

              <div className={styles.eventInformation}>
                <div className={styles.titleButtonContainer}>
                  <Image src={Racquet} alt="Racquet" />
                  <p style={{ display: 'inline' , fontSize:'1.25rem', textAlign:'center', width:'60%'}}>{event.title}</p>
                  {/* Square button next to event title */}
                  <Image src = {Arrow} style={{width:'33px', height:'35px'}} alt = "Arrow" onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id as string | null)} /> 
                </div>                
                {/* Center-aligned details */}
                <div className={styles.eventDetails}>
                  <p>Time: {formatTime(event.start)}</p>
                  <p>Slots open: {(event.maxParticipants + event.maxVolunteers) - event.participants.length} out of {(event.maxParticipants + event.maxVolunteers)}</p>
                </div>
                {expandedEventId === event.id && !isEventFull && (
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
                    {/* Dynamic generation of family member checkboxes */}
                    <label>
                      <input
                        type="checkbox"
                        name="participant-main"
                        checked={selectedMembers.includes(`${user.firstName} ${user.lastName}`)}
                        onChange={() => handleCheckboxChange(`${user.firstName} ${user.lastName}`)}
                      />
                      {user.firstName} {user.lastName}
                    </label>
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
                      disabled={selectedMembers.length === 0}
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
        <p>No events upcoming.</p>
      )}
    </div>
  );
}
);

export default UpcomingEvents;
