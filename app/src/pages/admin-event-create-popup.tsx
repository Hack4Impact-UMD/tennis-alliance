import React, { useState } from "react";
import Image from "next/image";
import { DayPicker } from "react-day-picker";
import styles from "@/styles/popup.module.css";
import xMark from "@/assets/x_black.svg";
import "react-day-picker/dist/style.css";
import { adminCreateEvent } from "@/backend/FirestoreCalls";
import Router from "next/router";

const Popup = () => {
    const [visible, setVisible] = useState(false);
    const [eventName, setEventName] = useState("");
    const [startTime, setStartTime] = useState({
        hours: "10",
        minutes: "30",
        period: "AM",
    });
    const [endTime, setEndTime] = useState({
        hours: "1",
        minutes: "30",
        period: "PM",
    });

    const [selectedDay, setSelectedDay] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [maxParticipants, setMaxParticipants] = useState(0);
    const [maxVolunteers, setMaxVolunteers] = useState(0);
    const [description, setDescription] = useState("");
    const [isRepeatWeekly, setIsRepeatWeekly] = useState(false);
    const [repeatCount, setRepeatCount] = useState(1);

    const openPopup = () => setVisible(true);

    const closePopup = () => {
        setVisible(false);
        setEventName("");
        setStartTime({ hours: "10", minutes: "30", period: "AM" });
        setEndTime({ hours: "1", minutes: "30", period: "PM" });
        setMaxParticipants(0);
        setMaxVolunteers(0);
        setDescription("");
        setIsRepeatWeekly(false);
        setRepeatCount(1);
    };

    const submitEvent = async () => {
        if (isRepeatWeekly && repeatCount > 0) {
            const events = [];
            let currentEventDate = new Date(selectedDay);
    
            for (let i = 0; i < repeatCount; i++) {
                events.push({ date: new Date(currentEventDate), index: i });
                currentEventDate = new Date(currentEventDate);
                currentEventDate.setDate(currentEventDate.getDate() + 7);
            }

            console.log(events);
    
            events.forEach(async ({ date, index }) => {
                await adminCreateEvent(
                    `${eventName} #${index + 1}`,
                    startTime,
                    endTime,
                    date,
                    maxParticipants,
                    maxVolunteers,
                    description
                );
            });
        } else {
            await adminCreateEvent(
                eventName,
                startTime,
                endTime,
                selectedDay,
                maxParticipants,
                maxVolunteers,
                description
            );
        }
    
        closePopup();
        Router.reload();
    };

    const handleDayClick = (day: Date) => {
        setSelectedDay(day);
    };

    const handleStartTimeChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        setStartTime({ ...startTime, [field]: e.target.value });
    };

    const handleEndTimeChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        setEndTime({ ...endTime, [field]: e.target.value });
    };

    const togglePeriod = (timeType: string) => {
        if (timeType === "start") {
            setStartTime({
                ...startTime,
                period: startTime.period === "AM" ? "PM" : "AM",
            });
        } else {
            setEndTime({
                ...endTime,
                period: endTime.period === "AM" ? "PM" : "AM",
            });
        }
    };

    return (
        <>
            <button onClick={openPopup} className={styles.popupButton}>
                <div className={styles.plus}>+</div>
                Create New Event
            </button>
            {visible && (
                <div className={styles.popup}>
                    <div className={styles.popupInner}>
                        <button
                            onClick={closePopup}
                            className={styles.closeButton}
                        >
                            <Image src={xMark} alt="close" />
                        </button>
                        <p className={styles.title}>Event Name:</p>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className={styles.inputBox}
                        />
                        <p className={styles.title}>Date</p>
                        <div className={styles.calendar}>
                            <DayPicker
                                mode="single"
                                selected={selectedDay}
                                onDayClick={handleDayClick}
                            />
                        </div>
                        <p className={styles.title}>Time(s)</p>
                        <div className={styles.timePicker}>
                            <input
                                type="number"
                                value={startTime.hours}
                                onChange={(e) =>
                                    handleStartTimeChange(e, "hours")
                                }
                                className={styles.timeInput}
                                min={1}
                                max={12}
                            />
                            <span className={styles.colon}>:</span>
                            <input
                                type="number"
                                value={startTime.minutes}
                                onChange={(e) =>
                                    handleStartTimeChange(e, "minutes")
                                }
                                className={styles.timeInput}
                                min={0}
                                max={59}
                            />
                            <button
                                onClick={() => togglePeriod("start")}
                                className={styles.periodButton}
                            >
                                {startTime.period}
                            </button>
                            <span className={styles.dash}>-</span>
                            <input
                                type="number"
                                value={endTime.hours}
                                onChange={(e) =>
                                    handleEndTimeChange(e, "hours")
                                }
                                className={styles.timeInput}
                                min={1}
                                max={12}
                            />
                            <span className={styles.colon}>:</span>
                            <input
                                type="number"
                                value={endTime.minutes}
                                onChange={(e) =>
                                    handleEndTimeChange(e, "minutes")
                                }
                                className={styles.timeInput}
                                min={0}
                                max={59}
                            />
                            <button
                                onClick={() => togglePeriod("end")}
                                className={styles.periodButton}
                            >
                                {endTime.period}
                            </button>
                        </div>
                        <div className={styles.maxSelect}>
                            <p className={styles.maxTitle}>
                                Max # of Participants
                            </p>
                            <input
                                type="number"
                                className={styles.maxInput}
                                min={0}
                                onChange={(e) =>
                                    setMaxParticipants(parseInt(e.target.value))
                                }
                            />
                            <p className={styles.maxTitle}>
                                Max # of Volunteers
                            </p>
                            <input
                                type="number"
                                className={styles.maxInput}
                                min={0}
                                onChange={(e) =>
                                    setMaxVolunteers(parseInt(e.target.value))
                                }
                            />
                        </div>
                        <div className={styles.repeatSection}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isRepeatWeekly}
                                    onChange={(e) =>
                                        setIsRepeatWeekly(e.target.checked)
                                    }
                                />
                                <span> </span>Repeat Event?
                            </label>
                            {isRepeatWeekly && (
                                <div className={styles.repeatCount}>
                                    <p>Occurences:</p>
                                    <input
                                        type="number"
                                        value={repeatCount}
                                        onChange={(e) =>
                                            setRepeatCount(
                                                parseInt(e.target.value) || 1
                                            )
                                        }
                                        min={1}
                                        className={styles.repeatInput}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className={styles.title}>Description:</div>
                            <textarea
                                className={styles.descriptionInput}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={500}
                                value={description}
                            />
                            <div className={styles.charCounter}>
                                {description.length}/500
                            </div>
                        </div>
                        <div className={styles.submitCancelContainer}>
                            <button
                                onClick={submitEvent}
                                className={styles.submitCancelButton}
                            >
                                Submit
                            </button>
                            <button
                                onClick={closePopup}
                                className={styles.submitCancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Popup;
