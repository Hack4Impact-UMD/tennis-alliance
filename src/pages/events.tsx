/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import logo from "./racket.png";
import leftChevron from "./left-chevron.png";
import xMark from "./x.png";
import { Disclosure } from "@headlessui/react";


const CalendarApp = () => {
    const [registrationStates, setRegistrationStates] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDayEvents, setSelectedDayEvents] = useState([]);

    // list of events
    const events = [
        { name: "Teaching Youth Lessons", 
            date: "2023-11-12", 
            time: "3:00pm", 
            description: "Assisting children ages 10-12 with tennis practice and learning different skills", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: ["volunteer", "participant"]},
        { name: "Court Cleanup", 
            date: "2023-11-13", 
            time: "3:00pm", 
            description: "", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "volunteer"},
        { name: "Teaching Adult Lessons", 
            date: "2023-11-14",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant"},
        { name: "Teaching Adult Lessons", 
            date: "2023-11-20",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant"},
        { name: "Teaching Adult Lessons", 
            date: "2023-11-18",                
            time: "5:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant"},
        { name: "Teaching Adult Lessons", 
            date: "2023-11-20",                
            time: "5:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant"}, 
        { name: "Court Cleanup", 
            date: "2023-11-20", 
            time: "8:00pm", 
            description: "", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "volunteer"}, 
        { name: "Teaching Adult Lessons", 
            date: "2023-11-25",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: ["volunteer", "participant"]},    
    ];

    const upcomingEvents = events.filter((event) => {
        return new Date(event.date).getDate() - new Date().getDate() >= 0;
    });

    const eventsToday = events.filter((event) => {
        return new Date(event.date).getDate() - new Date().getDate() === -1;
    });

    const formatDateMonthDay = (eventDate: string) => {
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

    const handleRegisterClick = (eventNameTime) => {
        setRegistrationStates(prev => ({ ...prev, [eventNameTime]: true }));
    };
    
    const handleCancelClick = (eventNameTime) => {
        setRegistrationStates(prev => ({ ...prev, [eventNameTime]: false }));
    };

    const getEventCountsByDay = (events) => {
        const counts = {};
        events.forEach((event) => {
            const dateStr = new Date(event.date + "T00:00:00").toDateString();
            counts[dateStr] = (counts[dateStr] || 0) + 1;
        });
        return counts;
    };

    const eventCounts = getEventCountsByDay(events);

    const renderDayCellContent = (arg) => {
        const dateStr = arg.date.toDateString();
        const eventCount = eventCounts[dateStr];

        let eventText = ""; 
        if (eventCount === 1) {
            eventText = "1 event"; // Text for a single event
        } else if (eventCount > 1) {
            eventText = `${eventCount} events`; // Text for multiple events
        }

        return (
            <>
                <div className="day-number">{arg.dayNumberText}</div>
                {eventCount > 0 && <div className="event-text">{eventText}</div>}
            </>
        );
    };

    const getDayCellClassNames = (arg) => {
        const dateStr = arg.date.toDateString();
        const eventCount = eventCounts[dateStr]; // Get the count of events for this day
        
        if (eventCount > 0) {
            // If there are events, return a class name that indicates this
            return "has-event";
        } else {
            // If there are no events, you can return an empty string or a different class
            return "";
        }
    };

    const handleDateClick = (arg) => {
        const clickedDayEvents = events.filter(event => event.date === arg.dateStr);
        setSelectedDayEvents(clickedDayEvents);
        setSelectedDate(arg.dateStr);
    };

    const handleClickOutside = (event) => {
        if (!document.getElementById("sub-container").contains(event.target)) {
            resetSelection();
        }
    };
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const resetSelection = () => {
        setSelectedDayEvents([]);
        setSelectedDate(null);
    };

    return (
        <div id="container">
            <ul id="sub-container">
                <p className="blue-border">New Events:</p>
                <div id="calendar">
                    <FullCalendar
                        initialView="dayGridMonth"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        titleFormat={{month: "long"}}
                        headerToolbar={{start: "", center: "title", end: ""}}
                        dayHeaders={false}
                        fixedWeekCount={false}
                        events={events}
                        aspectRatio={1.6}
                        eventDisplay="none"
                        dayCellContent={renderDayCellContent}
                        dayCellClassNames={getDayCellClassNames}
                        dateClick={handleDateClick}
                        selectable={true}
                    />
                </div>

                {selectedDayEvents.length > 0 && (
                    <div>
                        <p className="blue-border">{selectedDate}</p>
                        {selectedDayEvents.map((event) => (
                            <div>
                                <table className={getClassName(event.type)}>
                                    <tbody>
                                        <tr>
                                            <td className="event-td left-td">{formatDateMonthDay(event.date)}<br></br>{listTypes(event.type)}</td>
                                            <td className="event-td"> 
                                                <Disclosure>
                                                    {({open}) =>
                                                        <>
                                                            <div className="header-with-button">
                                                                <Disclosure.Button className="disclosure-toggle">
                                                                    {open ? (
                                                                        <Image className="x" src={xMark} alt="close" />
                                                                    ) : (
                                                                        <Image className="arrow-down" src={leftChevron} alt="open" />
                                                                    )}
                                                                </Disclosure.Button><br></br>
                                                                <div className="header-content">
                                                                    <Image className="object-cover" src={logo} alt="gwg"/> {event.name}<br></br>
                                                                    <span className="small-font">Time: {event.time}<br></br>{event.description}<br></br>Slots open: {event.slotsOpen} out of {event.totalSlots}</span><br></br>
                                                                </div>
                                                            </div>
                                                            <Disclosure.Panel >
                                                                {!registrationStates[event.name + event.time] && (
                                                                    <button className="button-event" onClick={() => handleRegisterClick(event.name + event.time)}>Register</button> 
                                                                )}
                                                                {registrationStates[event.name + event.time] && (
                                                                    <div>
                                                                        <form>
                                                                            <p>Would you like to register as a participant or volunteer?</p>
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input type="radio" value="participant" name="registration" /> participant  <br></br>
                                                                                    <input type="radio" value="volunteer" name="registration" /> volunteer  <br></br>
                                                                                </label>
                                                                            </div>

                                                                            <p>Please select the names of the people in your group who will be participating</p>
                                                                            <div className="checkbox">
                                                                                <input type="checkbox" value="registrant1" name="group" /> registrant1 
                                                                                <input type="checkbox" value="registrant2" name="group" /> registrant2
                                                                                <input type="checkbox" value="registrant3" name="group" /> registrant3
                                                                            </div>
                                                                            <div className="button-container">
                                                                                <button className="submit-button" type="submit">Submit</button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                )}
                                                                <button className="button-event" onClick={() => handleCancelClick(event.name + event.time)}>Cancel</button>
                                                            </Disclosure.Panel>
                                                        </>
                                                    }
                                                </Disclosure>
                                            </td> 
                                        </tr>
                                    </tbody>
                                </table>
                                <br></br>
                            </div>
                        ))}
                    </div>
                )}

                {!selectedDate && (
                    <div>
                        {eventsToday.map((event) => (
                            <div>
                                <br></br>
                                <table className="today-events-container">
                                    <tbody>
                                        <tr>
                                            <td className="event-td left-td">Today's Events<br></br><br></br>{formatDateMonthDay(event.date)}</td>
                                            <td className="event-td">
                                                <Image className="object-cover" src={logo} alt="gwg"/> {event.name}<br></br>
                                                <span className="small-font">Time: {event.time}<br></br>{event.description}<br></br>Slots open: {event.slotsOpen} out of {event.totalSlots}</span><br></br>
                                                {!registrationStates[event.name + event.time] && (
                                                    <button className="button-event" onClick={() => handleRegisterClick(event.name + event.time)}>Register</button> 
                                                )}
                                                {registrationStates[event.name + event.time] && (
                                                    <div>
                                                        <form>
                                                            <p>Would you like to register as a participant or volunteer?</p>
                                                            <div className="radio">
                                                                <label>
                                                                    <input type="radio" value="participant" name="registration" /> participant  <br></br>
                                                                    <input type="radio" value="volunteer" name="registration" /> volunteer  <br></br>
                                                                </label>
                                                            </div>

                                                            <p>Please select the names of the people in your group who will be participating</p>
                                                            <div className="checkbox">
                                                                <input type="checkbox" value="registrant1" /> registrant1 
                                                                <input type="checkbox" value="registrant2" /> registrant2
                                                                <input type="checkbox" value="registrant3" /> registrant3
                                                            </div>
                                                            <div className="button-container">
                                                                <button className="submit-button" type="submit">Submit</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                                <button className="button-event" onClick={() => handleCancelClick(event.name + event.time)}>Cancel</button>
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
                                            <td className="event-td left-td">{formatDateMonthDay(event.date)}<br></br>{listTypes(event.type)}</td>
                                            <td className="event-td"> 
                                                <Disclosure>
                                                    {({open}) =>
                                                        <>
                                                            <div className="header-with-button">
                                                                <Disclosure.Button className="disclosure-toggle">
                                                                    {open ? (
                                                                        <Image className="x" src={xMark} alt="close" />
                                                                    ) : (
                                                                        <Image className="arrow-down" src={leftChevron} alt="open" />
                                                                    )}
                                                                </Disclosure.Button><br></br>
                                                                <div className="header-content">
                                                                    <Image className="object-cover" src={logo} alt="gwg"/> {event.name}<br></br>
                                                                    <span className="small-font">Time: {event.time}<br></br>{event.description}<br></br>Slots open: {event.slotsOpen} out of {event.totalSlots}</span><br></br>
                                                                </div>
                                                            </div>
                                                            <Disclosure.Panel >
                                                                {!registrationStates[event.name + event.time] && (
                                                                    <button className="button-event" onClick={() => handleRegisterClick(event.name + event.time)}>Register</button> 
                                                                )}
                                                                {registrationStates[event.name + event.time] && (
                                                                    <div>
                                                                        <form>
                                                                            <p>Would you like to register as a participant or volunteer?</p>
                                                                            <div className="radio">
                                                                                <label>
                                                                                    <input type="radio" value="participant" name="registration" /> participant  <br></br>
                                                                                    <input type="radio" value="volunteer" name="registration" /> volunteer  <br></br>
                                                                                </label>
                                                                            </div>

                                                                            <p>Please select the names of the people in your group who will be participating</p>
                                                                            <div className="checkbox">
                                                                                <input type="checkbox" value="registrant1" name="group" /> registrant1 
                                                                                <input type="checkbox" value="registrant2" name="group" /> registrant2
                                                                                <input type="checkbox" value="registrant3" name="group" /> registrant3
                                                                            </div>
                                                                            <div className="button-container">
                                                                                <button className="submit-button" type="submit">Submit</button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                )}
                                                                <button className="button-event" onClick={() => handleCancelClick(event.name + event.time)}>Cancel</button>
                                                            </Disclosure.Panel>
                                                        </>
                                                    }
                                                </Disclosure>
                                            </td> 
                                        </tr>
                                    </tbody>
                                </table>
                                <br></br>
                            </div>
                        ))}
                    </div>
                )}
            </ul>
        </div>
    );
};

export default CalendarApp;


