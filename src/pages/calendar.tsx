/* eslint-disable react/no-unescaped-entities */
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./calendar_style.css";

const CalendarApp = () => {
    const events = [
        { name: "Teaching Youth Lessons", 
            date: "2023-10-04", 
            time: "3:00pm", 
            description: "Assisting children ages 10-12 with tennis practice and learning different skills", 
            slotsOpen: 7, 
            totalSlots: 20, 
            display: "background",
            backgroundColor: "#82C27B"},
        { name: "Court Cleanup", 
            date: "2023-10-17", 
            time: "3:00pm", 
            description: "", 
            slotsOpen: 7, 
            totalSlots: 20, 
            display: "background",
            backgroundColor: "#82C27B"},
        { name: "Teaching Adult Lessons", 
            date: "2023-10-15",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            display: "background",
            backgroundColor: "#82C27B"},
        { name: "Teaching Adult Lessons", 
            date: "2023-10-20",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            display: "background",
            backgroundColor: "#82C27B"},    
    ];

    const upcomingEvents = events.filter((event) => {
        return new Date(event.date) > new Date()
    })

    const eventsToday = events.filter((event) => {
        return new Date(event.date).getDate() - new Date().getDate() === -1
    })

    const formatDate = (eventDate: string) => {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      
        const dateObj = new Date(eventDate);
        const month = months[dateObj.getUTCMonth()];
        const day = dateObj.getUTCDate();
      
        return `${month} ${day}`;
    }

    return (
        <div id="container">
            <ul>
                <div id="calendar">
                    <FullCalendar
                    initialView="dayGridMonth"
                    plugins={[dayGridPlugin]}
                    titleFormat={{month: 'long'}}
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
                                    <td className="event-td">{event.name}<br></br><span className="small-font">Time: {event.time}<br></br>{event.description}<br></br>Slots open: {event.slotsOpen} out of {event.totalSlots}</span></td> 
                                </tr>
                            </tbody>
                        </table>
                    </div>  
                ))}

                <p className="yellow-border">Upcoming Events</p>

                {upcomingEvents.map((event) => (
                    <div>
                        <table className="upcoming-events-container">
                            <tbody>
                                <tr>
                                    <td className="event-td left-td">{formatDate(event.date)}</td>
                                    <td className="event-td">{event.name}<br></br><span className="small-font">Time: {event.time}<br></br>Slots open: {event.slotsOpen} out of {event.totalSlots}</span></td> 
                                </tr>
                            </tbody>
                        </table>
                        <br></br>
                    </div>
                ))}
            </ul>
        </div>
    )
};

export default CalendarApp;