import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import os from "os";
import styles from "@/styles/admin.module.css";
import Email from "@/assets/email.png";
import Trash from "@/assets/trash.png";
import Popup from "./admin-event-create-popup";
import { adminDeleteParticipant, adminGetEvents, getUserWithId } from "@/backend/FirestoreCalls";
import { CustomEvent, User } from "@/types";
import TennisBalls from "@/assets/tennis_balls.png";
import Calendar from "@event-calendar/core";
import TimeGrid from "@event-calendar/time-grid";
import DayGrid from "@event-calendar/day-grid";
import Interaction from "@event-calendar/interaction";
import "@event-calendar/core/index.css";
import DashboardEvents from "../components/dashboard-events";

const AGE_FILTERS = {
    "All Ages": "all",
    Adults: "Adult",
    Children: "Child",
};

const ROLE_FILTERS = {
    "All Roles": "all",
    Participants: "Participant",
    Volunteers: "Volunteer",
};

type AttendeeRow = {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    ageGroup: "Adult" | "Child";
    role: string;
    contactEmail: string;
    accountType: string;
    participantId: string;
    householdLabel: string;
};

type AttendeeGroup = {
    id: string;
    participantId: string;
    householdLabel: string;
    contactEmail: string;
    accountType: string;
    rows: AttendeeRow[];
};

const normalizeName = (firstName: string, lastName: string) =>
    `${firstName.trim().toLowerCase()} ${lastName.trim().toLowerCase()}`;

const toDashboardEvent = (event: CustomEvent): CustomEvent => ({
    ...event,
    start: `${event.date}T${event.start}`,
    end: `${event.date}T${event.end}`,
});

const escapeCsvValue = (value: string) => {
    const normalizedValue = value.replace(/"/g, "\"\"");
    return `"${normalizedValue}"`;
};

const slugifyFilenamePart = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const AdminDashboard = () => {
    const calendarRef = useRef<HTMLDivElement | null>(null);
    const [search, setSearch] = useState("");
    const [ageFilter, setAgeFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [download, setDownload] = useState("");
    const [downloadFileName, setDownloadFileName] = useState("attendees.csv");
    const downloadLink = useRef<HTMLAnchorElement>(null);
    const [eventData, setEventData] = useState<CustomEvent[]>([]);
    const [attendeeGroups, setAttendeeGroups] = useState<AttendeeGroup[]>([]);
    const [selectedEventTitle, setSelectedEventTitle] = useState("No event selected");
    const [displayedDate2, setDisplayedDate2] = useState<string>("No date selected");
    const [upcomingEvents, setUpcomingEvents] = useState<CustomEvent[]>([]);
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState<CustomEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [calendarViewDate, setCalendarViewDate] = useState<string>("");
    const [weekRange, setWeekRange] = useState<string>("");  // New state for the week range
    const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
    const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
    const [isLoadingAttendees, setIsLoadingAttendees] = useState<boolean>(false);
    const [deletingAttendeeId, setDeletingAttendeeId] = useState<string | null>(null);
    const selectedDateRef = useRef(selectedDate);
    const selectedEventIdRef = useRef<string | null>(selectedEvent?.id ?? null);

    const isLoadingDashboard = isLoadingEvents;
    selectedDateRef.current = selectedDate;
    selectedEventIdRef.current = selectedEvent?.id ?? null;

    const buildAttendeeGroups = useCallback(async (event: CustomEvent): Promise<AttendeeGroup[]> => {
        const groups = await Promise.all(
            event.participants.map(async (participantObj, index) => {
                const participantId = String(participantObj.mainId);
                let user: User | null = null;

                try {
                    user = await getUserWithId(participantId);
                } catch (error) {
                    console.error(`Failed to fetch user with ID ${participantId}:`, error);
                }

                const mainNameKey = normalizeName(
                    participantObj.mainFirstName,
                    participantObj.mainLastName
                );
                const uniqueMembers = participantObj.otherMembers.filter((member, memberIndex, members) => {
                    const memberKey = normalizeName(member.firstName, member.lastName);
                    return (
                        members.findIndex(
                            (candidate) =>
                                normalizeName(candidate.firstName, candidate.lastName) === memberKey
                        ) === memberIndex
                    );
                });
                const membersToRender = uniqueMembers.length > 0
                    ? uniqueMembers
                    : [{
                        firstName: participantObj.mainFirstName,
                        lastName: participantObj.mainLastName,
                    }];

                const rows = membersToRender.map((member, memberIndex) => {
                    const memberKey = normalizeName(member.firstName, member.lastName);
                    const isPrimary = memberKey === mainNameKey;
                    const isChild = !isPrimary && Boolean(
                        user?.children?.some(
                            (child) =>
                                normalizeName(child.childFirstName, child.childLastName) === memberKey
                        )
                    );

                    return {
                        id: `${participantId}-${memberKey}-${memberIndex}`,
                        firstName: member.firstName,
                        lastName: member.lastName,
                        displayName: `${member.firstName} ${member.lastName}`,
                        ageGroup: isChild ? "Child" : "Adult",
                        role:
                            participantObj.role === "participant"
                                ? "Participant"
                                : participantObj.role === "volunteer"
                                    ? "Volunteer"
                                    : "Unknown",
                        contactEmail: participantObj.email,
                        accountType: user?.type === "family" ? "Family Account" : "Adult Account",
                        participantId,
                        householdLabel:
                            user?.type === "family"
                                ? `${participantObj.mainLastName} Family`
                                : `${participantObj.mainFirstName} ${participantObj.mainLastName}`,
                    } satisfies AttendeeRow;
                });

                return {
                    id: `${participantId}-${index}`,
                    participantId,
                    householdLabel:
                        user?.type === "family"
                            ? `${participantObj.mainLastName} Family`
                            : `${participantObj.mainFirstName} ${participantObj.mainLastName}`,
                    contactEmail: participantObj.email,
                    accountType: user?.type === "family" ? "Family Account" : "Adult Account",
                    rows,
                } satisfies AttendeeGroup;
            })
        );

        return groups.filter((group) => group.rows.length > 0);
    }, []);

    const monthDay = (date: string) => {
        // Parse the input date (in 'YYYY-MM-DD' format)
        const [, month, day] = date.split("-");

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

    const reconcileSelectedEvent = useCallback(async (
        normalizedEvents: CustomEvent[],
        currentSelectedDate: string,
        currentSelectedEventId: string | null
    ) => {
        if (currentSelectedDate) {
            setEventsForSelectedDate(
                normalizedEvents.filter((event) => event.date === currentSelectedDate)
            );
        }

        if (!currentSelectedEventId) {
            return;
        }

        const nextSelectedEvent = normalizedEvents.find(
            (event) => event.id === currentSelectedEventId
        ) ?? null;

        if (!nextSelectedEvent) {
            setSelectedEvent(null);
            setSelectedEventTitle("No event selected");
            setAttendeeGroups([]);
            setIsLoadingAttendees(false);
            return;
        }

        setIsLoadingAttendees(true);
        try {
            const groups = await buildAttendeeGroups(nextSelectedEvent);
            setSelectedEvent(nextSelectedEvent);
            setSelectedEventTitle(nextSelectedEvent.title);
            setAttendeeGroups(groups);
        } finally {
            setIsLoadingAttendees(false);
        }
    }, [buildAttendeeGroups]);

    const refreshEvents = useCallback(async () => {
        const currentSelectedDate = selectedDateRef.current;
        const currentSelectedEventId = selectedEventIdRef.current;

        setIsLoadingEvents(true);
        try {
            const events = await adminGetEvents();
            const normalizedEvents = events.map(toDashboardEvent);

            setEventData(events);
            await reconcileSelectedEvent(
                normalizedEvents,
                currentSelectedDate,
                currentSelectedEventId
            );
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [reconcileSelectedEvent]);

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
    }, []);

    useEffect(() => {
        refreshEvents();
    }, [refreshEvents]);

    const filteredGroups = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return attendeeGroups
            .map((group) => {
                const rows = group.rows.filter((row) => {
                    const matchesAgeFilter = ageFilter === "all" || row.ageGroup === ageFilter;
                    const matchesRoleFilter = roleFilter === "all" || row.role === roleFilter;
                    const matchesSearch =
                        searchValue === "" ||
                        row.displayName.toLowerCase().includes(searchValue) ||
                        row.contactEmail.toLowerCase().includes(searchValue) ||
                        group.householdLabel.toLowerCase().includes(searchValue);

                    return matchesAgeFilter && matchesRoleFilter && matchesSearch;
                });

                return {
                    ...group,
                    rows,
                };
            })
            .filter((group) => group.rows.length > 0);
    }, [ageFilter, attendeeGroups, roleFilter, search]);

    const filteredEmailRecipients = useMemo(() => {
        const uniqueEmails = new Set<string>();

        filteredGroups.forEach((group) => {
            group.rows.forEach((row) => {
                const normalizedEmail = row.contactEmail.trim().toLowerCase();
                if (normalizedEmail.length > 0) {
                    uniqueEmails.add(normalizedEmail);
                }
            });
        });

        return Array.from(uniqueEmails);
    }, [filteredGroups]);

    useEffect(() => {
        if (download.length > 0) {
            downloadLink.current?.click();
            setDownload("");
            setDownloadFileName("attendees.csv");
        }
    }, [download]);

    const downloadUsers = () => {
        if (filteredGroups.length === 0) {
            alert("There are no attendees to export for the current selection and filters.");
            return;
        }

        const csvRows = filteredGroups.flatMap((group) =>
            group.rows.map((row) =>
                [
                    row.displayName,
                    row.ageGroup,
                    row.role,
                    row.contactEmail,
                    row.accountType,
                    group.householdLabel,
                ]
                    .map((value) => escapeCsvValue(String(value)))
                    .join(",")
            )
        );

        const fileNameParts = [
            selectedEventTitle !== "No event selected"
                ? slugifyFilenamePart(selectedEventTitle)
                : "",
            selectedDate ? selectedDate : "",
            "attendees",
        ].filter((part) => part.length > 0);

        csvRows.unshift([
            "Attendee",
            "Age Group",
            "Role",
            "Contact Email",
            "Account Type",
            "Household",
        ].join(","));

        setDownloadFileName(`${fileNameParts.join("-") || "attendees"}.csv`);
        setDownload(csvRows.join(os.EOL));
    };

    const emailFilteredAttendees = () => {
        if (filteredEmailRecipients.length === 0) {
            alert("No attendee emails match the current event and filters.");
            return;
        }

        window.location.href = `mailto:?bcc=${encodeURIComponent(filteredEmailRecipients.join(","))}`;
    };

    const getRowColor = (role: string): string => {
        return role === "Volunteer" ? "#FCF7CE" : "#E4F5E2";
    };

    const handleSelectEvent = async (event: CustomEvent) => {
        setIsLoadingAttendees(true);
        try {
            const groups = await buildAttendeeGroups(event);

            setAttendeeGroups(groups);
            setSelectedEventTitle(event.title);
            setSelectedEvent(event);
        } catch (error) {
            console.error("Error fetching participants data:", error);
        } finally {
            setIsLoadingAttendees(false);
        }
    };

    const handleDeleteAttendee = async (row: AttendeeRow) => {
        if (!selectedEvent?.id) {
            return;
        }

        const confirmed = window.confirm(
            `Remove ${row.displayName} from ${selectedEvent.title}?`
        );

        if (!confirmed) {
            return;
        }

        setDeletingAttendeeId(row.id);
        try {
            await adminDeleteParticipant(
                selectedEvent,
                selectedEvent.id,
                row.participantId,
                {
                    firstName: row.firstName,
                    lastName: row.lastName,
                },
                row.contactEmail,
                true
            );

            const updatedEvent = {
                ...selectedEvent,
                participants: [...selectedEvent.participants],
            };
            const updatedGroups = await buildAttendeeGroups(updatedEvent);

            setSelectedEvent(updatedEvent);
            setAttendeeGroups(updatedGroups);
            setEventData((prev) =>
                prev.map((eventItem) =>
                    eventItem.id === selectedEvent.id
                        ? updatedEvent
                        : eventItem
                )
            );
            setEventsForSelectedDate((prev) =>
                prev.map((eventItem) =>
                    eventItem.id === selectedEvent.id
                        ? updatedEvent
                        : eventItem
                )
            );

            alert(`${row.displayName} has been removed successfully.`);
        } catch (error) {
            console.error("Failed to delete participant:", error);
            alert("An error occurred while removing the participant.");
        } finally {
            setDeletingAttendeeId(null);
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
            const month = String(estDate.getMonth() + 1).padStart(2, "0");
            const day = String(estDate.getDate()).padStart(2, "0");
            const todayInEST = `${year}-${month}-${day}`;

            const currentWeekStart = new Date(weekRange.split(" - ")[0]);
            const currentWeekEnd = new Date(weekRange.split(" - ")[1]);

            const upcomingEventList: CustomEvent[] = [];

            eventData.forEach(event => {
                const dateKey = event.date;
                eventCountByDate[dateKey] = (eventCountByDate[dateKey] || 0) + 1;

                let eventObj: CustomEvent = {
                    id: "",
                    title: "",
                    start: "",
                    end: "",
                    description: "",
                    date: "",
                    participants: [],
                    maxParticipants: 0,
                    maxVolunteers: 0,
                };

                if (!eventsByDate[dateKey]) {
                    eventsByDate[dateKey] = [];
                }
                if (event.title) {
                    eventObj = {
                        id: event.id,
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

                const eventDate = new Date(dateKey);

                // Add events that are within the week range
                if (eventDate >= currentWeekStart && eventDate <= currentWeekEnd) {
                    upcomingEventList.push(eventObj);
                }

            });

            // Create aggregated events for the calendar

            Object.keys(eventCountByDate).forEach(date => {
                calendarEvents.push({
                    id: date,
                    title: `${eventCountByDate[date]} event${eventCountByDate[date] > 1 ? "s" : ""}`,
                    start: `${date}T00:00`,
                    end: `${date}T23:59`,
                    description: "temporary description",
                    date: date,
                    participants: [],
                    maxParticipants: 0,
                    maxVolunteers: 0,
                });
            });

            upcomingEventList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setUpcomingEvents(upcomingEventList);

            const ec = new Calendar({
                target: calendarRef.current,
                props: {
                    plugins: [TimeGrid, DayGrid, Interaction],
                    options: {
                        view: "dayGridMonth",
                        date: new Date(`${calendarViewDate || todayInEST}T00:00:00`),
                        events: calendarEvents,
                        highlightedDates: selectedDate ? [selectedDate] : [],
                        eventContent: (info) => info.event.title,
                        dateClick: (info) => {
                            const clickedDate = info.date.toISOString().split("T")[0];
                            const nextSelectedDate = selectedDate === clickedDate ? "" : clickedDate;

                            setCalendarViewDate(clickedDate);
                            setSelectedDate(nextSelectedDate);
                            setEventsForSelectedDate(nextSelectedDate ? (eventsByDate[clickedDate] || []) : []);
                            setDisplayedDate2(nextSelectedDate ? monthDay(clickedDate) : "No date selected");
                            setSelectedEventTitle("No event selected"); // Ensure this is reset
                            setSelectedEvent(null);
                            setAttendeeGroups([]);
                            setIsLoadingAttendees(false);
                        },
                        eventClick: (info) => {
                            const clickedDate = info.event.start.toISOString().split("T")[0];
                            const nextSelectedDate = selectedDate === clickedDate ? "" : clickedDate;

                            setCalendarViewDate(clickedDate);
                            setSelectedDate(nextSelectedDate);
                            setEventsForSelectedDate(nextSelectedDate ? (eventsByDate[clickedDate] || []) : []);
                            setDisplayedDate2(nextSelectedDate ? monthDay(clickedDate) : "No date selected");
                            setSelectedEventTitle("No event selected");
                            setSelectedEvent(null);
                            setAttendeeGroups([]);
                            setIsLoadingAttendees(false);
                        },
                    },
                },
            });

            return () => {
                ec.destroy();
            };
        }
    }, [calendarViewDate, eventData, selectedDate, weekRange]);

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
                    {<Popup onEventCreated={refreshEvents} />}
                </div>
                {isLoadingDashboard ? (
                    <div className={styles.loadingState}>
                        <div className={styles.inlineSpinner} aria-hidden="true" />
                        <p>Loading dashboard...</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.selectedDateContainer}>
                            <div className={styles.selectedDateText}>Date selected:</div>
                            <div className={styles.selectedEvent}>{displayedDate2}</div>
                        </div>
                        <DashboardEvents
                            events={selectedDate ? eventsForSelectedDate : upcomingEvents}
                            onSelectEvent={handleSelectEvent}
                            onEventUpdated={refreshEvents}
                            onEventDeleted={refreshEvents}
                            emptyMessage={selectedDate ? "No events" : null}
                        />
                        <div className={styles.selectedEventContainer}>
                            <div className={styles.selectedEventText}>Event selected:</div>
                            <div className={styles.selectedEvent}>{selectedEventTitle}</div>
                        </div>
                        <p>Attendees</p>
                        <div className={styles.search}>
                            <input
                                type="text"
                                placeholder="Search attendees"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                                {Object.entries(AGE_FILTERS).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                                {Object.entries(ROLE_FILTERS).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={`${styles.row} ${styles.header}`}>
                            <span>Attendee</span>
                            <span>Age Group</span>
                            <span>Role</span>
                            <span>Contact Email</span>
                            <div />
                            <div />
                        </div>
                        {isLoadingAttendees ? (
                            <div className={styles.loadingStateCompact}>
                                <div className={styles.inlineSpinner} aria-hidden="true" />
                                <p>Loading attendees...</p>
                            </div>
                        ) : filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <div key={group.id} className={styles.groupCard}>
                                    <div className={styles.groupHeader}>
                                        <div>
                                            <p className={styles.groupTitle}>{group.householdLabel}</p>
                                            <p className={styles.groupMeta}>Primary Contact: {group.contactEmail}</p>
                                        </div>
                                        <p className={styles.groupType}>{group.accountType}</p>
                                    </div>
                                    <div className={styles.groupRows}>
                                        {group.rows.map((row) => {
                                            const isDeleting = deletingAttendeeId === row.id;

                                            return (
                                                <div
                                                    key={row.id}
                                                    className={styles.row}
                                                    style={{ background: getRowColor(row.role) }}
                                                >
                                                    <span>{row.displayName}</span>
                                                    <span>{row.ageGroup}</span>
                                                    <span>{row.role}</span>
                                                    <span>{row.contactEmail}</span>
                                                    <button>
                                                        <a href={`mailto:${row.contactEmail}`} target="_blank" rel="noreferrer"><Image src={Email} alt="mail" /></a>
                                                    </button>
                                                    <button disabled={isDeleting} onClick={() => handleDeleteAttendee(row)}>
                                                        {isDeleting ? (
                                                            <span className={styles.buttonContent}>
                                                                <span className={styles.inlineSpinnerSmall} aria-hidden="true" />
                                                    Removing...
                                                            </span>
                                                        ) : (
                                                            <Image src={Trash} alt="delete" />
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyTableState}>
                                {selectedEventTitle === "No event selected"
                                    ? "Select an event to view attendees."
                                    : attendeeGroups.length === 0
                                        ? "No attendees are currently registered for this event."
                                        : "No attendees match the current filters."}
                            </div>
                        )}
                        <div className={styles.buttons}>
                            <button onClick={emailFilteredAttendees} disabled={filteredEmailRecipients.length === 0}>
                        Email All
                            </button>
                            <button onClick={downloadUsers} disabled={filteredGroups.length === 0}>
                        Export Attendees
                            </button>
                            <a
                                href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                                    download
                                )}`}
                                download={downloadFileName}
                                hidden={true}
                                ref={downloadLink}
                            ></a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
