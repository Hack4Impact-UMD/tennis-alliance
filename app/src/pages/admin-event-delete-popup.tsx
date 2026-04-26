import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/popup.module.css";
import xMark from "@/assets/x_black.svg";
import { adminDeleteEvent, adminGetEventById } from "@/backend/FirestoreCalls";

interface DeletePopUpProps {
    eventID: string;
    onEventDeleted?: () => Promise<void>;
}

const DeletePopUp: React.FC<DeletePopUpProps> = ({ eventID, onEventDeleted }) => {
    const [visible, setVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const openPopup = (event?: React.MouseEvent) => {
        event?.stopPropagation();
        setVisible(true);
    };
    const closePopup = (event?: React.MouseEvent) => {
        event?.stopPropagation();
        setVisible(false);
    };
    const [eventTitle, setEventTitle] = useState<string>("");

    const deleteEvent = async () => {
        setIsDeleting(true);
        try {
            await adminDeleteEvent(eventID);
            closePopup();
            if (onEventDeleted) {
                await onEventDeleted();
            }
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
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

        if (visible && eventID) {
            fetchEvent();
        }
    }, [visible, eventID]);

    return (
        <>
            <button onClick={openPopup} className={styles.popupButton}>
                Delete
            </button>
            {visible && (
                <div className={styles.popup} onClick={(event) => event.stopPropagation()}>
                    <div className={styles.popupInner} onClick={(event) => event.stopPropagation()}>
                        <button
                            onClick={closePopup}
                            className={styles.closeButton}
                            disabled={isDeleting}
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
                                onClick={(event) => {
                                    event.stopPropagation();
                                    deleteEvent();
                                }}
                                className={styles.confirmButton}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <span className={styles.buttonContent}>
                                        <span className={styles.inlineSpinner} aria-hidden="true" />
                                        Deleting...
                                    </span>
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeletePopUp;
