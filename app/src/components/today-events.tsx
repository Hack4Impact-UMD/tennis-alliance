import React, {forwardRef} from "react";
import styles from "@/styles/today-events.module.css";
import { type CustomEvent, type User } from "@/types";
import Arrow from "@/assets/down_arrow.png";
import Racquet from "@/assets/tennis_racquet.png";
import Image from "next/image";
import {addUserToEvent} from "@/backend/CloudFunctionsCalls";

interface TodayEventsProps {
 events: CustomEvent[];
 user: User;
 onRegisterEvent: (eventId: string) => Promise<void>;
}


const TodayEvents = forwardRef<HTMLDivElement, TodayEventsProps>(function TodayEvents({
    events,
    user,
    onRegisterEvent}, ref) {
    const INITIAL_VISIBLE_EVENTS = 3;
    const VISIBLE_EVENTS_STEP = 3;


    const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);
    const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
    const [role, setRole] = React.useState<string>("participant");
    const [submittingEventId, setSubmittingEventId] = React.useState<string | null>(null);
    const [visibleEventCount, setVisibleEventCount] = React.useState(INITIAL_VISIBLE_EVENTS);
    const eventIdsKey = events.map((event) => event.id ?? "").join("|");

    const getRoleCounts = (event: CustomEvent) => {
        return event.participants.reduce(
            (totals, participant) => {
                const memberCount = Array.isArray(participant.otherMembers)
                    ? participant.otherMembers.length
                    : 0;

                if (participant.role === "participant") {
                    totals.participants += memberCount;
                } else if (participant.role === "volunteer") {
                    totals.volunteers += memberCount;
                }

                return totals;
            },
            { participants: 0, volunteers: 0 }
        );
    };




    // Function to get the correct ordinal suffix for the day
    const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return "th"; // Special case for numbers 11-20
        switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
        }
    };


    const formatTimeRange = (startTimeString: string, endTimeString: string) => {
        const startTime = startTimeString.split("T")[1];
        const endTime = endTimeString.split("T")[1];
        return `${startTime} - ${endTime}`;
    };


    // Get today's date
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("default", { month: "long" }); // Full month name
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
        setSubmittingEventId(eventId);
        //  console.log("user auth id: ", user.auth_id);
        //  console.log("event id: ", eventId);
        // console.log("members: ", selectedMembers.map(member => {
        //   const [firstName, lastName] = member.split(' ');
        //   return { firstName, lastName };
        // }));
        try {
            await addUserToEvent(
                user.auth_id,
                eventId,
                selectedMembers.map(member => {
                    const [firstName, lastName] = member.split(" ");
                    return { firstName, lastName };
                }),
                role === "volunteer" ? "volunteer" : "participant"
            );
            await onRegisterEvent(eventId);
            alert("You have successfully registered for the event!");
            setExpandedEventId(null);
            setSelectedMembers([]);
        } catch (error) {
            console.error("Error registering for event:", error);
            alert("There was an error. Please try again.");
        } finally {
            setSubmittingEventId(null);
        }
    };


    const handleCheckboxChange = (memberName: string) => {
        setSelectedMembers(prev =>
            prev.includes(memberName) ? prev.filter(name => name !== memberName) : [...prev, memberName]
        );
    };

    React.useEffect(() => {
        setVisibleEventCount(INITIAL_VISIBLE_EVENTS);
    }, [eventIdsKey]);

    const visibleEvents = events.slice(0, visibleEventCount);
    const hiddenEventCount = Math.max(0, events.length - visibleEventCount);
    const nextVisibleCount = Math.min(events.length, visibleEventCount + VISIBLE_EVENTS_STEP);
    const revealCount = nextVisibleCount - visibleEventCount;


    return (
        <div ref = {ref} className={styles.todayEventsContainer}>
            {events.length > 0 ? (
                visibleEvents.map(event => {
                    const isExpanded = expandedEventId === event.id;
                    const isSubmitting = submittingEventId === event.id;
                    const roleCounts = getRoleCounts(event);
                    const participantSlotsOpen = event.maxParticipants - roleCounts.participants;
                    const volunteerSlotsOpen = event.maxVolunteers - roleCounts.volunteers;
                    const isParticipantFull = participantSlotsOpen <= 0;
                    const isVolunteerFull = volunteerSlotsOpen <= 0;
                    const isEventFull = isParticipantFull && isVolunteerFull;
                    const selectedRoleIsFull =
          role === "volunteer" ? isVolunteerFull : isParticipantFull;
                    const remainingSlotsForSelectedRole =
          role === "volunteer" ? Math.max(0, volunteerSlotsOpen) : Math.max(0, participantSlotsOpen);
                    const selectedMembersExceedRemainingSlots =
          selectedMembers.length > remainingSlotsForSelectedRole;
                    const selectionLimitReached =
          selectedMembers.length >= remainingSlotsForSelectedRole;

                    return (

                        <div key={event.id} className={styles.individualEvent}>
                            <div className={styles.dateSection}>
                                <p>{`${month} ${dayWithSuffix}`}</p> {/* Display today's date */}
                            </div>


                            {/* Divider line */}
                            <div className={styles.divider}></div>


                            <div className={styles.eventInformation}>
                                <div className={styles.titleButtonContainer}>
                                    <Image src={Racquet} alt="Racquet" className={styles.titleIcon} />
                                    <div className={styles.titleStack}>
                                        <p className={styles.titleText}>{event.title}</p>
                                        {isEventFull && <span className={styles.statusBadge}>Full</span>}
                                    </div>
                                    <Image
                                        className={styles.titleAction}
                                        src={Arrow}
                                        style={{
                                            width:"33px",
                                            height:"35px",
                                            cursor: "pointer",
                                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.2s ease",
                                        }}
                                        alt="Arrow"
                                        onClick={() => {
                                            if (isExpanded) {
                                                setExpandedEventId(null);
                                                setSelectedMembers([]);
                                                setRole("participant");
                                                return;
                                            }

                                            setExpandedEventId(event.id ?? null);
                                            setSelectedMembers([]);

                                            if (!isParticipantFull) {
                                                setRole("participant");
                                            } else if (!isVolunteerFull) {
                                                setRole("volunteer");
                                            }
                                        }}
                                    />
                                </div>
                                <div className={styles.eventDetails}>
                                    <p className={styles.summaryRow}><span className={styles.summaryLabel}>Time:</span> <span className={styles.summaryValue}>{formatTimeRange(event.start, event.end)}</span></p>
                                    <p className={styles.summaryRow}><span className={styles.summaryLabel}>Participant spots:</span> <span className={styles.summaryValue}>{Math.max(0, participantSlotsOpen)} out of {event.maxParticipants}</span></p>
                                    <p className={styles.summaryRow}><span className={styles.summaryLabel}>Volunteer spots:</span> <span className={styles.summaryValue}>{Math.max(0, volunteerSlotsOpen)} out of {event.maxVolunteers}</span></p>
                                </div>
                                {isExpanded && !isEventFull && (
                                    <div className={styles.registrationForm}>
                                        <p className={styles.descriptionText}><span className={styles.descriptionLabel}>Description:</span> {event.description}</p>
                                        <p className={styles.registrationFormQuestion}>Would you like to register as a participant or volunteer?</p>
                                        <div className={styles.radioButtonRow}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="participant"
                                                    checked={role === "participant"}
                                                    disabled={isParticipantFull}
                                                    onChange={() => setRole("participant")}
                                                />
                     Participant{isParticipantFull ? " (Full)" : ""}
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="volunteer"
                                                    checked={role === "volunteer"}
                                                    disabled={isVolunteerFull}
                                                    onChange={() => setRole("volunteer")}
                                                />
                     Volunteer{isVolunteerFull ? " (Full)" : ""}
                                            </label>
                                        </div>
                                        <p className={styles.registrationFollowup}>Please select the names of the people in your group who will be participating:</p>
                                        <div className={styles.checkboxGroup}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="participant-main"
                                                    checked={selectedMembers.includes(`${user.firstName} ${user.lastName}`)}
                                                    disabled={
                                                        !selectedMembers.includes(`${user.firstName} ${user.lastName}`) &&
                      selectionLimitReached
                                                    }
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
                                                        disabled={!selectedMembers.includes(adult.name) && selectionLimitReached}
                                                        onChange={() => handleCheckboxChange(adult.name)} />
                                                    {adult.name}
                                                </label>
                                            ))}
                                            {user.children?.map((child, index) => (
                                                <label key={`child-${index}`}>
                                                    <input
                                                        type="checkbox"
                                                        name={`participant-child-${index}`}
                                                        checked={selectedMembers.includes(`${child.childFirstName} ${child.childLastName}`)}
                                                        disabled={
                                                            !selectedMembers.includes(`${child.childFirstName} ${child.childLastName}`) &&
                           selectionLimitReached
                                                        }
                                                        onChange={() => handleCheckboxChange(`${child.childFirstName} ${child.childLastName}`)}/>
                                                    {child.childFirstName} {child.childLastName}
                                                </label>
                                            ))}
                                        </div>
                                        <div className = {styles.buttonWrapper}>
                                            <button
                                                className={styles.submitBtn}
                                                disabled = {
                                                    selectedMembers.length === 0 ||
                     selectedRoleIsFull ||
                     isSubmitting ||
                     selectedMembersExceedRemainingSlots
                                                }
                                                onClick={() =>
                                                {
                                                    handleSubmit(event.id);
                                                }}
                                            >
                                                {isSubmitting ? (
                                                    <span className={styles.buttonContent}>
                                                        <span className={styles.inlineSpinner} aria-hidden="true" />
                       Registering...
                                                    </span>
                                                ) : (
                                                    selectedRoleIsFull
                                                        ? "Role Full"
                                                        : selectedMembersExceedRemainingSlots
                                                            ? "Too Many Selected"
                                                            : "Submit"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {!isExpanded && isEventFull && (
                                    <div className={styles.buttonWrapper}>
                                        <button
                                            className={styles.submitBtn}
                                            disabled
                                        >
                   Full
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No unregistered events today.</p>
            )}
            {hiddenEventCount > 0 && (
                <button
                    type="button"
                    className={styles.showMoreButton}
                    onClick={() => setVisibleEventCount(nextVisibleCount)}
                >
         Show {revealCount} more
                </button>
            )}
            {hiddenEventCount === 0 && events.length > INITIAL_VISIBLE_EVENTS && (
                <button
                    type="button"
                    className={styles.showMoreButton}
                    onClick={() => setVisibleEventCount(INITIAL_VISIBLE_EVENTS)}
                >
         Show less
                </button>
            )}
        </div>
    );
}
);


export default TodayEvents;
