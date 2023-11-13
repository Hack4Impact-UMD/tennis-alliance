
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import "./user_dashboard.css";
import Event from "../types";
import React, { useState } from "react";
import Image from "next/image";
import logo  from "./racket.png";
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


const CalendarApp = () => {
    const [chevronDown, setChevronDown] = useState(false);
    const userPerspective = "u7"; // which user we're fetching the registered events for in this example

    // list of events
    const events = [
        { id: 1,
            title: "Teaching Youth Lessons", 
            startDateTime: 1700164800, // Nov 16 3:00 pm
            endDateTime: 1700168400, // Nov 16 4:00 pm
            description: "Assisting children ages 10-12 with tennis practice and learning different skills", 
            slotsOpen: 7, 
            totalSlots: 20, 
            participants: ["u4", "u5", "u7"],
            volunteers: ["u1", "u2", "u3"],
            display: "background"},
        {  id: 2,
            title: "Court Cleanup", 
            startDateTime: 1700226000, // Nov 17 8:00 am
            endDateTime: 1700247600, // Nov 17 2:00 pm
            description: "", 
            slotsOpen: 7, 
            totalSlots: 20, 
            participants: ["u1", "u4"],
            volunteers: ["u2", "u3"],
            display: "background"},
        {  id: 3,
            title: "Teaching Adult Lessons", 
            startDateTime: 1700337600, // Nov 18 3:00 pm
            endDateTime: 1700341200, // Nov 18 4:00 pm
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            participants: ["u7"],
            volunteers: ["u2", "u3"],
            type: "participant",
            display: "background"},
        {  id: 4,
            title: "Teaching Adult Lessons", 
            startDateTime: 1700502900, // Nov 20 12:55 pm
            endDateTime: 1700514000, // Nov 20 4:00 pm
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            participants: ["u4", "u5", "u7"],
            volunteers: ["u1", "u2", "u3"],
            type: "participant",
            display: "background"},
        {  id: 5,
            title: "Teaching Adult Lessons", 
            startDateTime: 1700943600, // Nov 25 3:20 pm
            endDateTime: 1700946000, // Nov 25 4:00 pm
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            participants: ["u2", "u3", "u7"],
            volunteers: ["u1"],
            display: "background"},    
    ];
    

    const upcomingEvents = events.filter((event) => {
        return (event.startDateTime *  1000) - Date.now() >= 0;
    });

     //checking which events the selected user is paticipating/volunteering in
    const involvedEvents = upcomingEvents.filter((event) => {
        return event.participants.includes(userPerspective) || event.volunteers.includes(userPerspective); 
    });

    const formatDate = (timestamp: number) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
      
        const dateObj = new Date(timestamp * 1000); //multiply by 1000 to go from seconds to milliseconds
        const month = months[dateObj.getMonth()];
        const day = dateObj.getDate();
      
        return `${month} ${day}`;
    };

    const getTime = (timestamp: number) => {
        const dateObj = new Date(timestamp * 1000); //multiply by 1000 to go from seconds to milliseconds
        let hours = dateObj.getHours();
        console.log(dateObj.getDate());
        let minutes = dateObj.getMinutes();
        let  minutesString = minutes.toString().padStart(2, '0');
        let timeOfDay = (hours > 12)? "PM" : "AM";
        hours = (hours % 12 == 0)? 12: hours % 12;
        return `${hours}:${minutesString} ${timeOfDay}`;
    };

    const getEventType = (eventType: Event, userPerspective: string) => {
        if (eventType.participants.includes(userPerspective)) {
            return "Participant";
        } else {
            return "Volunteer";
        }
    };

    const handleRemoveClick = () => {
        
    };

    return (
        <div id="container">
            <ul>
            <p className="blue-border">Events Registered:</p>
                <div className="registered-full-container">
                    {involvedEvents.map((event) => (
                        <div className={`registered-event registered-event-${getEventType(event, userPerspective).toLowerCase()}`}>
                            <table className="registered-event">
                                <tbody>
                                    <tr>
                                        <td className="event-td left-td">{formatDate(event.startDateTime)}<br></br>{getEventType(event, userPerspective)}</td>
                                        <td className="right-td">
                                            <div className="name-div">
                                                <div id="icon-and-name" className="name-div">
                                                    <div>
                                                        <Image
                                                            className="racket-logo"
                                                            src={logo}
                                                            alt="A black-and-white drawing of a tennis racket"
                                                            style={{verticalAlign: "middle", marginRight: "15px", alignSelf: "center"}}
                                                        />
                                                    </div>
                                                        <span>{event.title}</span>
                                                </div>
                                                <ChevronDownIcon style={{position: "relative", width: "45px"}}/>
                                            </div>
                                            <span style={{fontSize: "16px"}}>Time: {getTime(event.startDateTime)}</span><br></br><span style={{fontSize: "14px"}}>Slots open: {event.slotsOpen} out of {event.totalSlots}</span><br></br>
                                            <button className="button-event" onClick={handleRemoveClick}>Remove</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </ul>
        </div>
    );
};

export default CalendarApp;



