import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/popup.module.css";
import xMark from "@/assets/x.png";


const DeletePopUp = () => {
    const [visible, setVisible] = useState(false);

    const openPopup = () => setVisible(true);
    const closePopup = () => setVisible(false);
    const confirmEvent = () => {
        // Handle the confirm logic
        closePopup();
    };

    return (
        <>
            <button onClick={openPopup} className={styles.popupButton}>Delete</button>
            {visible && (
                <div className={styles.popup}>
                    <div className={styles.popupInner}>
                        <button onClick={closePopup} className={styles.closeButton}>
                            <Image className={styles.xMark} src={xMark} alt="close" />
                        </button>
                        <ul>
                            <p className={styles.deleteText}>
                                You have Selected:<br></br>
                                Event Name<br></br><br></br>
                                Cancel Event?
                            </p>
                            <div className={styles.confirmButtonContainer}>
                                <button onClick={confirmEvent} className={styles.confirmButton}>confirm</button>
                            </div>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeletePopUp;