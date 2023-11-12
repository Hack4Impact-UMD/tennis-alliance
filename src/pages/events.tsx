/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import Image from "next/image";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./events_style.css";
import logo from "./racket.png";

const CalendarApp = () => {
    const [showRegistration, setShowRegistration] = useState(false);

    // list of events
    const events = [
        { name: "Teaching Youth Lessons", 
            date: "2023-11-11", 
            time: "3:00pm", 
            description: "Assisting children ages 10-12 with tennis practice and learning different skills", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: ["volunteer", "participant"],
            display: "background",
            backgroundColor: "#82C27B"},
        { name: "Court Cleanup", 
            date: "2023-11-12", 
            time: "3:00pm", 
            description: "", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "volunteer",
            display: "background",
            backgroundColor: "#82C27B"},
        { name: "Teaching Adult Lessons", 
            date: "2023-11-13",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant",
            display: "background",
            backgroundColor: "#82C27B"},
        { name: "Teaching Adult Lessons", 
            date: "2023-11-20",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant",
            display: "background",
            backgroundColor: "#82C27B"},
        { name: "Teaching Adult Lessons", 
            date: "2023-11-25",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: ["volunteer", "participant"],
            display: "background",
            backgroundColor: "#82C27B"},    
    ];

    const upcomingEvents = events.filter((event) => {
        return new Date(event.date).getDate() - new Date().getDate() >= 0;
    });

    const eventsToday = events.filter((event) => {
        return new Date(event.date).getDate() - new Date().getDate() === -1;
    });

    const formatDate = (eventDate: string) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
      
        const dateObj = new Date(eventDate);
        const month = months[dateObj.getUTCMonth()];
        const day = dateObj.getUTCDate();
      
        return `${month} ${day}`;
    };

    const getClassName = (eventType: any) => {
        if (Array.isArray(eventType)) {
            return "upcoming-events-container-both";
        } else {
            return `upcoming-events-container-${eventType}`;
        }
    };

    const listTypes = (eventType: any) => {
        if (Array.isArray(eventType)) {
            return "";
        } else if (eventType === "volunteer") {
            return "Volunteer";
        } else {
            return "Participant";
        }
    };

    const handleRegisterClick = () => {
        setShowRegistration(true);
    };

    const handleCancelClick = () => {
        setShowRegistration(false);
    };

    return (
        <div id="container">
            <ul>
                <p className="blue-border">New Events:</p>
                <div id="calendar">
                    <FullCalendar
                        initialView="dayGridMonth"
                        plugins={[dayGridPlugin]}
                        titleFormat={{month: "long"}}
                        headerToolbar={{start: "", center: "title", end: ""}}
                        dayHeaders={false}
                        fixedWeekCount={false}
                        events={events}
                        aspectRatio= {1.6}
                    />
                </div>

                {eventsToday.map((event) => (
                    <div>
                        <br></br>
                        <table className="today-events-container">
                            <tbody>
                                <tr>
                                    <td className="event-td left-td">Today's Events<br></br><br></br>{formatDate(event.date)}</td>
                                    <td className="event-td">
                                        <Image className="object-cover" src={logo} alt="gwg"/> {event.name}<br></br>
                                        <span className="small-font">Time: {event.time}<br></br>{event.description}<br></br>Slots open: {event.slotsOpen} out of {event.totalSlots}</span><br></br>
                                        <button className="button-event" onClick={handleRegisterClick}>Register</button> 
                                        {showRegistration && (
                                            <div>
                                                <form>
                                                    <p>Would you like to register as a participant or volunteer?</p>
                                                    <div className="radio">
                                                        <label>
                                                            <input type="radio" value="participant" name="registration" /> participant
                                                            <input type="radio" value="volunteer" name="registration" /> volunteer
                                                        </label>
                                                    </div>

                                                    <p>Please select the names of the people in your group who will be participating</p>
                                                    <div className="checkbox">
                                                        <input type="checkbox" value="registrant1" /> registrant1
                                                        <input type="checkbox" value="registrant2" /> registrant2
                                                        <input type="checkbox" value="registrant3" /> registrant3
                                                    </div>
                                                    <button type="submit">Submit</button>
                                                </form>
                                            </div>
                                        )}
                                        <button className="button-event" onClick={handleCancelClick}>Cancel</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>  
                ))}

                <p className="blue-border">Upcoming Events</p>

                {upcomingEvents.map((event) => (
                    <div>
                        <table className={getClassName(event.type)}>
                            <tbody>
                                <tr>
                                    <td className="event-td left-td">{formatDate(event.date)}<br></br>{listTypes(event.type)}</td>
                                    <td className="event-td"> 
                                        <Image className="object-cover" src={logo} alt="gwg"/> {event.name}<br></br>
                                        <span className="small-font">Time: {event.time}<br></br>Slots open: {event.slotsOpen} out of {event.totalSlots}</span>
                                    </td> 
                                </tr>
                            </tbody>
                        </table>
                        <br></br>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default CalendarApp;
