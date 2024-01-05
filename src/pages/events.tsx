import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { DayCellContentArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventDisclosure from "@/components/EventDisclosure";
import EventForm from "@/components/EventForm";

import styles from "@/styles/events.module.css";
import logo from "@/assets/racket.png";

type EventType = {
    id: string;
    name: string;
    date: string;
    time: string;
    description: string;
    slotsOpen: number;
    totalSlots: number;
    type: string | string[];
};

interface DateClickInfo {
    date: Date;
    dateStr: string;
}

const CalendarApp = () => {
    const [selectedDate, setSelectedDate] = useState<null | string>(null);
    const [selectedDayEvents, setSelectedDayEvents] = useState<EventType[]>([]);
    const [eventCounts, setEventCounts] = useState<Record<string, number>>({});

    // list of events
    const events = useMemo(() => [
        { id: "001",
            name: "Teaching Youth Lessons", 
            date: "2024-01-12", 
            time: "3:00pm", 
            description: "Assisting children ages 10-12 with tennis practice and learning different skills", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: ["volunteer", "participant"]},
        { id: "002",
            name: "Court Cleanup", 
            date: "2024-01-13", 
            time: "3:00pm", 
            description: "Cleaning the court", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "volunteer"},
        { id: "003",
            name: "Teaching Adult Lessons", 
            date: "2024-01-14",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant"},
        { id: "004",
            name: "Teaching Adult Lessons", 
            date: "2024-01-20",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant"},
        { id: "005",
            name: "Teaching Adult Lessons", 
            date: "2024-01-18",                
            time: "5:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant"},
        { id: "006",
            name: "Teaching Adult Lessons", 
            date: "2024-01-20",                
            time: "5:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "participant"}, 
        { id: "007",
            name: "Court Cleanup", 
            date: "2024-01-20", 
            time: "8:00pm", 
            description: "", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: "volunteer"}, 
        { id: "008",
            name: "Teaching Adult Lessons", 
            date: "2024-01-20",                
            time: "3:00pm", 
            description: "Assisting adults with tennis practice", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: ["volunteer", "participant"]},
        { id: "009",
            name: "Teaching Youth Lessons", 
            date: "2024-01-04", 
            time: "3:00pm", 
            description: "Assisting children ages 10-12 with tennis practice and learning different skills", 
            slotsOpen: 7, 
            totalSlots: 20, 
            type: ["volunteer", "participant"]},    
    ], []);

    const upcomingEvents = useMemo(() => events.filter((event) => {
        return new Date(event.date).getDate() - new Date().getDate() >= 0;
    }), [events]);

    const eventsToday = useMemo(() => events.filter((event) => {
        return new Date(event.date).getDate() - new Date().getDate() === -1;
    }), [events]);

    const formatDateMonthDay = (eventDate: string): string => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
      
        const dateObj = new Date(eventDate);
        const month = months[dateObj.getUTCMonth()];
        const day = dateObj.getUTCDate();
      
        return `${month} ${day}`;
    };

    const getClassName = (eventType: string | string[]): string => {
        if (Array.isArray(eventType)) {
            return styles.upcomingEventsContainerBoth;
        } else {
            if (eventType === "volunteer") {
                return styles.upcomingEventsContainerVolunteer;
            } else {
                return styles.upcomingEventsContainerParticipant;
            }
        }
    };

    const listTypes = (eventType: string | string[]): string => {
        if (Array.isArray(eventType)) {
            return "";
        } else if (eventType === "volunteer") {
            return "Volunteer";
        } else {
            return "Participant";
        }
    };

    const getEventCountsByDay = (events: EventType[]): Record<string, number> => {
        const counts: Record<string, number> = {};
        events.forEach((event: { date: string; }) => {
            const dateStr = new Date(event.date + "T00:00:00").toDateString();
            counts[dateStr] = (counts[dateStr] || 0) + 1;
        });
        return counts;
    };

    const renderDayCellContent = (arg: DayCellContentArg) => {
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
                {arg.isToday && <div className={styles.todayEventText}>{eventText}</div>}
                {eventCount > 0 && !arg.isToday && <div className={styles.eventText}>{eventText}</div>}
            </>
        );
    };

    const getDayCellClassNames = (arg: DayCellContentArg) => {
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

    const handleDateClick = (arg: DateClickInfo) => {
        const clickedDayEvents = events.filter((event) => event.date === arg.dateStr);
        setSelectedDayEvents(clickedDayEvents);
        setSelectedDate(arg.dateStr);
    };

    const resetSelection = () => {
        setSelectedDayEvents([]);
        setSelectedDate(null);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        const subContainer = document.getElementById("subContainer");
        if (subContainer && !subContainer.contains(event.target as Node)) {
            resetSelection();
        }
    }, []);
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        const eventCounts = getEventCountsByDay(events);
        setEventCounts(eventCounts);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside, events]);
    
    return (
        <div className={styles.container}>
            <ul id="subContainer">
                <p className={styles.blueBorder}>New Events:</p>
                <div className={styles.calendar}>
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
                        <p className={styles.blueBorder}>{selectedDate}</p>
                        {selectedDayEvents.map((event) => (
                            <div key={event.id}>
                                <table className={getClassName(event.type)}>
                                    <tbody>
                                        <tr>
                                            <td className={styles.eventLeftTd}>
                                                <p>{formatDateMonthDay(event.date)}</p>
                                                <p>{listTypes(event.type)}</p>
                                            </td>
                                            <td className={styles.eventTd}> 
                                                <EventDisclosure 
                                                    event={event}
                                                />
                                            </td> 
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}

                {!selectedDate && (
                    <div>
                        {eventsToday.map((event) => (
                            <div key={event.id}>
                                <table className={styles.todayEventsContainer}>
                                    <tbody>
                                        <tr>
                                            <td className={styles.eventLeftTd}>
                                                <p>Today&apos;s Events</p>
                                                <p>{formatDateMonthDay(event.date)}</p>
                                            </td>
                                            <td className={styles.eventTd}>
                                                <Image className={styles.racket} src={logo} alt="racket" />
                                                <p className={styles.bigFont}>{event.name}</p>
                                                <p className={styles.smallFont}>Time: {event.time}</p>
                                                <p className={styles.smallFont}>Slots open: {event.slotsOpen} out of {event.totalSlots}</p>
                                                <p className={styles.smallFont}>{event.description}</p>

                                                <EventForm
                                                    event={event}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>  
                        ))}

                        <p className={styles.blueBorder}>Upcoming Events</p>

                        {upcomingEvents.map((event) => (
                            <div key={event.id}>
                                <table className={getClassName(event.type)}>
                                    <tbody>
                                        <tr>
                                            <td className={styles.eventLeftTd}>
                                                <p>{formatDateMonthDay(event.date)}</p>
                                                <p>{listTypes(event.type)}</p>
                                            </td>
                                            <td className={styles.eventTd}> 
                                                <EventDisclosure
                                                    event={event}
                                                />
                                            </td> 
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
            </ul>
        </div>
    );
};

export default CalendarApp;
