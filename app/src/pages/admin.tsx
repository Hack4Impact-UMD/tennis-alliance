import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import os from "os";
//import { users } from "@/tests/mock";
import styles from "@/styles/admin.module.css";
import Email from "@/assets/email.png";
import Trash from "@/assets/trash.png";
import Popup from "./admin-event-create-popup";
import { adminGetEvents, adminGetUsers, getUserWithId, adminDeleteParticipant, adminGetEventIDs } from "@/backend/FirestoreCalls";
import { User, CustomEvent } from "@/types";
import { set } from "date-fns";
import { useAuth } from "@/auth/AuthProvider";
import TennisBalls from "@/assets/tennis_balls.png";
import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import DayGrid from '@event-calendar/day-grid';
import Interaction from '@event-calendar/interaction';
import '@event-calendar/core/index.css';
import TodayEvents from '../components/today-events';
import { RegisteredEvents } from '../components/registered-events';
import UpcomingEvents from '../components/upcoming-events';
import DashboardEvents from '../components/dashboard-events';
import { Upcoming } from "@mui/icons-material";
import EditPopup from "./admin-event-edit-popup";
import DeletePopUp from "./admin-event-delete-popup";

const FILTERS = {
    "All Users": "all",
    Volunteer: "Volunteer",
    Participant: "Participant",
};

const AdminDashboard = () => {
    const auth = useAuth();
    const [data, setData] = useState<User[]>([]);
    const calendarRef = useRef<HTMLDivElement | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [download, setDownload] = useState("");
    const downloadLink = useRef<HTMLAnchorElement>(null);
    const [eventData, setEventData] = useState<CustomEvent[]>([]);
    const [userData, setUserData] = useState<User[]>([]);
    // const [selectedID, setSelectedID] = useState<string | null>(null);
    const [selectedEventTitle, setSelectedEventTitle] = useState("No event selected");
    const [allEmails, setAllEmails] = useState("");
    const [displayedDate, setDisplayedDate] = useState<string>('');  // State for the displayed date
    const [displayedDate2, setDisplayedDate2] = useState<string>("No date selected");
    const [events, setEvents] = useState<CustomEvent[]>([]);
    const [regUpcomingEvents, setRegUpcomingEvents] = useState<CustomEvent[]>([]);
    const [registeredEvents, setRegisteredEvents] = useState<CustomEvent[]>([]);
    const [todayEvents, setTodayEvents] = useState<CustomEvent[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<CustomEvent[]>([]);
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState<CustomEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const registeredEventListRef = useRef<CustomEvent[]>([]); // Persistent across renders
    const [calendarEvents, setCalendarEvents] = useState<CustomEvent[]>([]);
    const [todayInEST, setTodayInEST] = useState<string>('');  // New state for today's date in EST
    const [weekRange, setWeekRange] = useState<string>('');  // New state for the week range
    const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
    const [eventIDs, setEventIDs] = useState<{ [key: string]: string }>({});
    const [selectedEventID, setSelectedEventID] = useState<string | null>(null);

    // Utility to format date as "Month Day"
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };

    const monthDay = (date: string) => {
        // Parse the input date (in 'YYYY-MM-DD' format)
        const [year, month, day] = date.split('-');
    
        // Map the month number to the corresponding month name
        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];
        
        const monthName = monthNames[parseInt(month) - 1]; // Get the month name
    
        // Add the appropriate suffix to the day
        const suffix = (day: number) => {
            if (day >= 11 && day <= 13) return "th"; // Special case for 11th, 12th, 13th
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };
    
        const formattedDay = `${parseInt(day)}${suffix(parseInt(day))}`; // Add the suffix to the day
    
        return `${monthName} ${formattedDay}`;
    };
    

    /*useEffect(() => {
        // Set today's date on initial load
        const today = new Date();
        setDisplayedDate2(formatDate(today));
    }, []);*/

    useEffect(() => {
        const calculateCurrentWeekRange = () => {
            const now = new Date();
            const sundayStart = new Date(now);
            sundayStart.setDate(now.getDate() - now.getDay()); // Move to the previous Sunday
            const sundayEnd = new Date(sundayStart);
            sundayEnd.setDate(sundayStart.getDate() + 7); // Move to the next Sunday

            const formatDate = (date: Date) => {
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                return `${month}/${day}`;
            };

            const range = `${formatDate(sundayStart)} - ${formatDate(sundayEnd)}`;
            setWeekRange(range);
        };

        calculateCurrentWeekRange();
        /*console.log("weekRange: ", weekRange);*/
        const getEventIDs = async () => {
            try {
            const eventIDs = await adminGetEventIDs();
            console.log("Event ids: ", eventIDs);
            setEventIDs(eventIDs);
            } catch (error) {
            console.error("Error fetching event IDs:", error);
            }
        };
    
        getEventIDs();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const events = await adminGetEvents();
                setEventData(events);
                /*console.log("Events:", events);*/
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() =>  {
        const getUsers = async () => {
            try {
                const users = await adminGetUsers();
                setUserData(users);
                /*console.log("Users:", users);*/
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        getUsers();
    }, []);

    useEffect(() => {
        if (search || filter !== "all") {
            const filteredData = userData.filter(
                (row) =>
                    (filter === "all" || row.type === filter) &&
                    (search === "" ||
                        `${row.childFirstName} ${row.childLastName}`
                            .toLowerCase()
                            .includes(search.toLowerCase()))
            );
            setData(filteredData);
            setAllEmails(filteredData.map((user) => user.email).join(","));
        } else {
            setData([]); // Ensure no users are displayed initially
            setAllEmails(""); // Clear email list
        }
    }, [search, filter, userData]);

    useEffect(() => {
        if (download.length > 0) {
            downloadLink.current?.click();
            setDownload("");
        }
    }, [download]);

    const downloadUsers = async () => {
        const fields = Object.keys(userData);
        const csv = userData.map((user) => Object.values(user).join(","));
        csv.unshift(fields.join(","));
        setDownload(csv.join(os.EOL));
    };

    const getRowColor = (index: number): string => {
        return index % 2 == 0 ? "#E4F5E2" : "#FCF7CE";
    };

    const handleDateClick = (selectedDate: Date) => {
        const formattedDate = formatDate(selectedDate);
        setDisplayedDate2(formattedDate); // Update the displayed date
    };

    const handleSelectEvent = async (event: CustomEvent) => {
        try {
            const participantsData = await Promise.all(
                event.participants.map(async (participantObj: any) => {
                    const participantId = String(participantObj.mainId);
                    try {
                        /*console.log(participantObj);*/
                        const user = await getUserWithId(participantId);
                        return user;
                    } catch (error) {
                        console.error(`Failed to fetch user with ID ${participantId}:`, error);
                        return null;
                    }
                })
            );
    
            setData(participantsData.filter(user => user !== null));
            setAllEmails(participantsData.filter(user => user !== null).map((user) => user.email).join(","));
            setSelectedEventTitle(event.title);
            setSelectedEvent(event);
            setSelectedEventID(eventIDs[event.title]);
            console.log("Selected event:", event);
        } catch (error) {
            console.error("Error fetching participants data:", error);
        }
    };

    useEffect(() => {
        if (calendarRef.current) {
          const calendarEvents: CustomEvent[] = [];
          const eventCountByDate: { [key: string]: number } = {};
          const eventsByDate: { [key: string]: CustomEvent[] } = {};
    
          const now = new Date();
          const utcOffset = now.getTimezoneOffset() * 60000;
          const estOffset = 5 * 60 * 60000;
          const estDate = new Date(now.getTime() - utcOffset + estOffset);
    
          const year = estDate.getFullYear();
          const month = String(estDate.getMonth() + 1).padStart(2, '0');
          const day = String(estDate.getDate()).padStart(2, '0');
          const todayInEST = `${year}-${month}-${day}`;
    
          setDisplayedDate(todayInEST);
    
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();

          const currentWeekStart = new Date(weekRange.split(" - ")[0]);
          const currentWeekEnd = new Date(weekRange.split(" - ")[1]);
    
          const todayEventList: CustomEvent[] = [];
          const upcomingEventList: CustomEvent[] = [];
          const registeredEventList: CustomEvent[] = [];
    
          eventData.forEach(event => {
            const dateKey = event.date;
            eventCountByDate[dateKey] = (eventCountByDate[dateKey] || 0) + 1;
                  
            let eventObj: CustomEvent = {
              title: '',
              start: '',
              end: '',
              description: '',
              date: '',
              participants: [],
              maxParticipants: 0,
              maxVolunteers: 0,
            };
    
            if (!eventsByDate[dateKey]) {
              eventsByDate[dateKey] = [];
            }
            if (event.title) {
              eventObj = {
                title: event.title,
                start: `${event.date}T${event.start}`,
                end: `${event.date}T${event.end}`,
                description: event.description,
                date: event.date,
                participants: event.participants,
                maxParticipants: event.maxParticipants,
                maxVolunteers: event.maxVolunteers,
              };
            }
    
            eventsByDate[dateKey].push(eventObj);
    
            if (dateKey === todayInEST) {
              todayEventList.push(eventObj);
            }
    
            const eventDate = new Date(dateKey);
            const todayDate = new Date(todayInEST);
    
            // Add events that are within the week range
            if (eventDate >= currentWeekStart && eventDate <= currentWeekEnd) {
              upcomingEventList.push(eventObj);
            }
    
          });
    
          // Aggregate Registered Upcoming Events
          regUpcomingEvents.forEach(event => {
            const dateKey = event.date; // Get the date (YYYY-MM-DD)
            eventCountByDate[dateKey] = (eventCountByDate[dateKey] || 0) + 1;
            let eventObj: CustomEvent = {
              title: '',
              start: '',
              end: '',
              description: '',
              date: '',
              participants: [],
              maxParticipants: 0,
              maxVolunteers: 0,
            };
            if(!eventsByDate[dateKey]) {
              eventsByDate[dateKey] = [];
            }
            if(event.title){
                eventObj = {
                title: event.title,
                start: `${event.date}T${event.start}`,
                end: `${event.date}T${event.end}`,
                description: event.description,
                date: event.date,
                participants: event.participants,
                maxParticipants: event.maxParticipants,
                maxVolunteers: event.maxVolunteers,
              };
            }
            registeredEventList.push(eventObj);
          });
    
          // Create aggregated events for the calendar
          
          Object.keys(eventCountByDate).forEach(date => {
            calendarEvents.push({
              id: date,
              title: `${eventCountByDate[date]} event${eventCountByDate[date] > 1 ? 's' : ''}`,
              start: `${date}T00:00`,
              end: `${date}T23:59`,
              description: 'temporary description',
              date: date,
              participants: [],
              maxParticipants: 0,
              maxVolunteers: 0,
            });
          });
    
          setTodayEvents(todayEventList);
          upcomingEventList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setUpcomingEvents(upcomingEventList);
          setCalendarEvents(calendarEvents);
          registeredEventList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          registeredEventListRef.current = registeredEventList;
          setRegisteredEvents(registeredEventList);
          /*console.log("registeredEventList: ", registeredEventList);
          console.log("todayEventList: ", todayEventList);
          console.log("upcomingEventList: ", upcomingEventList);
          console.log("calendarEvents: ", calendarEvents);
          console.log("upcomingEvents: ", upcomingEvents);
          console.log("todayInEst: ", todayInEST);*/
          console.log("upcomingEvents: ", upcomingEvents);
    
          const ec = new Calendar({
            target: calendarRef.current,
            props: {
              plugins: [TimeGrid, DayGrid, Interaction],
              options: {
                view: 'dayGridMonth',
                events: calendarEvents,
                eventContent: (info) => info.event.title,
                dateClick: (info) => {
                  const clickedDate = info.date.toISOString().split('T')[0];
                  setSelectedDate(clickedDate);
                  setEventsForSelectedDate(eventsByDate[clickedDate] || []);
                  setDisplayedDate2(monthDay(clickedDate));
                  setSelectedEventTitle("No event selected"); // Ensure this is reset
                },
              },
            },
          });
    
          return () => {
            ec.destroy();
          };
        }
      }, [eventData, regUpcomingEvents, todayInEST, displayedDate]);

    return (
        <div className={styles.container}>
            <div className = {styles.headerContainer}>
                <div className = {styles.headers}>
                    <p className = {styles.eventSchedule}>Event Schedule</p>
                    <p className = {styles.eventWeek}>{weekRange}</p>
                </div>
                <div className = {styles.imgContainer}>
                    <Image src = {TennisBalls} alt = "Tennis Balls" className = {styles.tennisBalls}/>
                </div>
            </div>
            <div ref = {calendarRef} className={styles.calendar}></div>
            <div className={styles.table}>
                <div className={styles.createContainer}>
                    {<Popup/>}
                </div>
                <div className={styles.selectedDateContainer}>
                    <div className={styles.selectedDateText}>Date selected:</div>
                    <div className={styles.selectedEvent}>{displayedDate2}</div>
                </div>
                <DashboardEvents 
                    events={selectedDate ? eventsForSelectedDate : upcomingEvents}
                    onSelectEvent={handleSelectEvent}
                />
                <div className={styles.selectedEventContainer}>
                    <div className={styles.selectedEventText}>Event selected:</div>
                    <div className={styles.selectedEvent}>{selectedEventTitle}</div>
                </div>
                <p>All Users</p>
                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select onChange={(e) => setFilter(e.target.value)}>
                        {Object.entries(FILTERS).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={`${styles.row} ${styles.header}`}>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Type</span>
                    <div />
                    <div />
                </div>
                {data.map((row, i) => (
                    <div>    
                        <div
                            key={i}
                            className={styles.row}
                            style={{ background: getRowColor(i) }}
                        >
                            <span>{row.firstName + " " + row.lastName}</span>
                            <span>{row.email}</span>
                            <span>{row.type}</span>
                            <button>
                                <a href={`mailto:${row.email}`} target="_blank" rel="noreferrer"><Image src={Email} alt="mail" /></a>
                            </button>
                            <button
                                onClick={async () => {
                                try {
                                    await adminDeleteParticipant(
                                    selectedEvent,
                                    selectedEventID,
                                    row?.auth_id,
                                    row.email,
                                    true
                                    );

                                    alert(`${row.firstName} ${row.lastName} has been removed successfully.`);
                                    location.reload();
                                } catch (error) {
                                    console.error("Failed to delete participant:", error);
                                    alert("An error occurred while removing the participant.");
                                }
                                }}
                            >
                                <Image src={Trash} alt="delete" />
                            </button>
                        </div>
                        <div className={styles.children}>
                            {row.children?.map((child, i) => (
                                <div key={i} className={styles.child} style={{ background: getRowColor(i + 1) }}>
                                    Child {i + 1}: {child.childFirstName + " " + child.childLastName}
                                    <span>Account owner: {row.firstName + " " + row.lastName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className={styles.buttons}>
                    <button onClick={downloadUsers}>Export Users</button>
                    {/*<button><a href={`mailto:${auth.user.email}?bcc=${allEmails}`} target="_blank" rel="noreferrer">Message All Participants</a></button>*/}
                    <a
                        href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                            download
                        )}`}
                        download="users.csv"
                        hidden={true}
                        ref={downloadLink}
                    ></a>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
