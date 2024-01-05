import React, { useState } from "react";
import styles from "@/styles/events.module.css";

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

interface EventFormProps {
    event: EventType;
}

interface RegistrationStates {
    [key: string]: boolean;
}

const EventForm = ({ event }: EventFormProps) => {
    const [registrationStates, setRegistrationStates] = useState<RegistrationStates>({});

    const handleRegisterClick = (eventId: string) => {
        setRegistrationStates(prev => ({ ...prev, [eventId]: true }));
    };
    
    const handleCancelClick = (eventId: string) => {
        setRegistrationStates(prev => ({ ...prev, [eventId]: false }));
    };

    return (
        <>
            {!registrationStates[event.id] && (
                <div className={styles.buttonContainer}>
                    <button className={styles.buttonEvent} onClick={() => handleRegisterClick(event.id)}>Register</button> 
                    <button className={styles.buttonEvent} onClick={() => handleCancelClick(event.id)}>Cancel</button>
                </div>
            )}
            {registrationStates[event.id] && (
                <form className={styles.form}>
                    <p>Would you like to register as a participant or volunteer?</p>
                    <div className={styles.radio}>
                        <input type="radio" value="participant" name="registration" /> participant
                        <input type="radio" value="volunteer" name="registration" className={styles.space} /> volunteer
                    </div>

                    <p>Please select the names of the people in your group who will be participating</p>
                    <div className={styles.checkbox}>
                        <input type="checkbox" value="registrant1" name="group" /> registrant1<br />
                        <input type="checkbox" value="registrant2" name="group" /> registrant2<br />
                        <input type="checkbox" value="registrant3" name="group" /> registrant3
                    </div>

                    <button className={styles.submitButton} type="submit">Submit</button>
                </form>
            )}
        </>
    );
};

export default EventForm;

