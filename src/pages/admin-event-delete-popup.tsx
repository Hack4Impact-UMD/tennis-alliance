import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/popup.module.css";
import xMark from "@/assets/x_black.svg";

const DeletePopUp = () => {
    const [visible, setVisible] = useState(false);

    const openPopup = () => setVisible(true);
    const closePopup = () => setVisible(false);

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
                            Event Name
                        </p>
                        <p className={styles.deleteText}>Cancel Event?</p>
                        <div className={styles.confirmButtonContainer}>
                            <button
                                onClick={closePopup}
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
