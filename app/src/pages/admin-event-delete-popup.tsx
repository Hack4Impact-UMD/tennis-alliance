import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/popup.module.css";
import xMark from "@/assets/x_black.svg";
import { adminDeleteEvent, adminGetEventById } from "@/backend/FirestoreCalls";
import { adminGetEvents } from "@/backend/FirestoreCalls";

interface DeletePopUpProps {
    eventID: string;
}

const DeletePopUp: React.FC<DeletePopUpProps> = ({ eventID }) => {
    const [visible, setVisible] = useState(false);

    const openPopup = () => setVisible(true);
    const closePopup = () => setVisible(false);
    const [eventTitle, setEventTitle] = useState<string>("");

    const deleteEvent = () => {
        adminDeleteEvent(eventID);
        closePopup();
    }

    useEffect(() => {
        console.log(eventID);
        const fetchEvent = async () => {
            try {
                const event = await adminGetEventById(eventID);
                if (event) {
                    setEventTitle(event.title);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        if (eventID) {
            fetchEvent();
        }
    }, [visible]);

    return (
        <>
            <button onClick={openPopup} className={styles.popupButton}>
                Delete
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
                        <p className={styles.deleteText}>
                            You have Selected:<br></br>
                            <strong>{eventTitle || "Loading..."}</strong>
                        </p>
                        <p className={styles.deleteText}>Cancel Event?</p>
                        <div className={styles.confirmButtonContainer}>
                            <button
                                onClick={deleteEvent}
                                className={styles.confirmButton}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeletePopUp;
