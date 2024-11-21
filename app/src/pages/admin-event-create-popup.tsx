import React, { useState } from "react";
import Image from "next/image";
import { CaptionProps, DayPicker } from "react-day-picker";
import format from "date-fns/format";
import getYear from "date-fns/getYear";
import setYear from "date-fns/setYear";
import setMonth from "date-fns/setMonth";
import styles from "@/styles/popup.module.css";
import xMark from "@/assets/x_black.svg";
import "react-day-picker/dist/style.css";
import { adminCreateEvent } from "@/backend/FirestoreCalls";
import { create } from "domain";

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
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [maxParticipants, setMaxParticipants] = useState(0);
    const [maxVolunteers, setMaxVolunteers] = useState(0);
    const [description, setDescription] = useState("");
    const [isRepeatWeekly, setIsRepeatWeekly] = useState(false);
    const [repeatStartDate, setRepeatStartDate] = useState(new Date());
    const [repeatEndDate, setRepeatEndDate] = useState(new Date());

    /* PopUp Button */
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
        setRepeatStartDate(new Date());
        setRepeatEndDate(new Date());
    };

    const submitEvent = () => {
        if (isRepeatWeekly) {
            const start = new Date(repeatStartDate);
            const end = new Date(repeatEndDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return;
            }

            const events = [];
            let currentEventDate = new Date(start);

            while (currentEventDate <= end) {
                events.push(new Date(currentEventDate));
                const nextEventDate = new Date(currentEventDate);
                nextEventDate.setDate(currentEventDate.getDate() + 7);

                if (nextEventDate > end) {
                    break;
                }
                currentEventDate = nextEventDate;
            }

            events.forEach((date) => {
                adminCreateEvent(
                    eventName,
                    startTime,
                    endTime,
                    date,
                    maxParticipants,
                    maxVolunteers,
                    description
                );
            });
        } else {
            adminCreateEvent(
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
    };

    const handleRepeatStartDateChange = (day: Date) => setRepeatStartDate(day);
    const handleRepeatEndDateChange = (day: Date) => setRepeatEndDate(day);

    const customModifiersStyles = {
        selected: {
            color: "white",
            backgroundColor: "#000C79",
        },
    };

    /* TimePicker */
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

    /* DayPicker */
    const handleDayClick = (day: Date) => {
        setSelectedDay(day);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };

    const handleMonthChange = (month: number) => {
        setCurrentMonth(setMonth(currentMonth, month));
        setShowMonthPicker(false);
    };

    const handleYearChange = (year: number) => {
        setCurrentMonth(setYear(currentMonth, year));
        setShowYearPicker(false);
    };

    const handleMonthClick = () => {
        setShowMonthPicker((currentShowMonthPicker) => {
            // If opening monthPicker, ensure yearPicker is closed
            if (!currentShowMonthPicker) setShowYearPicker(false);
            return !currentShowMonthPicker;
        });
    };

    const handleYearClick = () => {
        setShowYearPicker((currentShowYearPicker) => {
            // If opening yearPicker, ensure monthPicker is closed
            if (!currentShowYearPicker) setShowMonthPicker(false);
            return !currentShowYearPicker;
        });
    };

    const handleParticipantsChange = (num: number) => {
        setMaxParticipants(num);
        console.log(num);
    }

    const handleVolunteersChange = (num: number) => {
        setMaxVolunteers(num);
        console.log(num);
    }

    const customCaption = ({ displayMonth }: CaptionProps) => {
        const currentYear = getYear(displayMonth);
        const startYear = currentYear - 2;
        const months = Array.from({ length: 12 }, (_, i) =>
            format(setMonth(displayMonth, i), "MMMM")
        );
        const years = Array.from({ length: 6 }, (_, i) => startYear + i);

        return (
            <div className={styles.calendarCaption}>
                <div
                    className={styles.calendarMonth}
                    onClick={handleMonthClick}
                >
                    {format(displayMonth, "MMMM")}
                    {showMonthPicker && (
                        <div className={styles.monthPicker}>
                            {months.map((month, index) => (
                                <div
                                    key={month}
                                    onClick={() => handleMonthChange(index)}
                                >
                                    {month}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.calendarYear} onClick={handleYearClick}>
                    {format(displayMonth, "yyyy")}
                    {showYearPicker && (
                        <div className={styles.yearPicker}>
                            {years.map((year) => (
                                <div
                                    key={year}
                                    onClick={() => handleYearChange(year)}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const customHead = () => {
        return null;
    };

    const modifiersStyles = {
        selected: {
            color: "white",
            backgroundColor: "#000C79",
        },
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
                        <p className={styles.title}>Date(s)</p>
                        <div className={styles.calendar}>
                            <DayPicker
                                mode="single"
                                selected={selectedDay}
                                onDayClick={handleDayClick}
                                month={currentMonth}
                                modifiersStyles={modifiersStyles}
                                components={{
                                    Caption: customCaption,
                                    Head: customHead,
                                }}
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
                                onChange={(e) => handleParticipantsChange(parseInt(e.target.value))}
                            />
                            <p className={styles.maxTitle}>
                                Max # of Volunteers
                            </p>
                            <input
                                type="number"
                                className={styles.maxInput}
                                min={0}
                                onChange={(e) => handleVolunteersChange(parseInt(e.target.value))}
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
                                Repeat Weekly
                            </label>
                            {isRepeatWeekly && (
                                <div className={styles.repeatDates}>
                                    <p>Repeat Start Date:</p>
                                    <DayPicker
                                        mode="single"
                                        selected={repeatStartDate}
                                        onDayClick={handleRepeatStartDateChange}
                                        modifiersStyles={customModifiersStyles}
                                    />
                                    <p>Repeat End Date:</p>
                                    <DayPicker
                                        mode="single"
                                        selected={repeatEndDate}
                                        onDayClick={handleRepeatEndDateChange}
                                        modifiersStyles={customModifiersStyles}
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
