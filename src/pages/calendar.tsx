/* eslint-disable react/no-unescaped-entities */
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./calendar_style.css";

const CalendarApp = () => {
    const events = [
        { title: "Teaching Youth Lessons", 
            date: "2023-10-04", 
            time: "3:00pm", 
            description: "Assisting children ages 10-12 with tennis practice and learning different skills", 
            slotsOpen: 7, 
            totalSlots: 20, 
            display: "background", 
            color: "#02D12B"},
        { title: "Court Cleanup", 
            date: "2023-10-12", 
            time: "3:00pm", 
            description: "", 
            slotsOpen: 7, 
            totalSlots: 20, 
            display: "background", 
            color: "#02D12B"},
        { title: "Teaching Adult Lessons", 
            date: "2023-10-15", 
            time: "3:00pm", 
            description: "", 
            slotsOpen: 7, 
            totalSlots: 20, 
            display: "background", 
            color: "#02D12B"},    
    ];

    return (
        <div>
            <div className="today-event">
                <h2>Today's Events</h2>
            </div>
            <div>
                <FullCalendar 
                    initialView="dayGridMonth" 
                    plugins={[ dayGridPlugin ]}
                    headerToolbar={{start: "", center: "title", end: ""}}
                    events={events}
                />
            </div>
        </div>
    );
};

export default CalendarApp;