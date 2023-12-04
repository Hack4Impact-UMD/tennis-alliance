import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/popup.module.css";
import xMark from "@/assets/x_black.svg";

const MessagePopUp = () => {
    const [visible, setVisible] = useState(false);
    const [messageContent, setMessageContent] = useState("");

    const openPopup = () => setVisible(true);
    const closePopup = () => setVisible(false);
    const sendEvent = () => {
        closePopup();
        setMessageContent("");
    };

    return (
        <>
            <button onClick={openPopup} className={styles.popupButton}>
                Message
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
                        <ul>
                            <p className={styles.title}>Input Message Here:</p>
                            <form>
                                <textarea
                                    value={messageContent}
                                    onChange={(e) =>
                                        setMessageContent(e.target.value)
                                    }
                                    className={styles.messageInputBox}
                                />
                            </form>
                            <div className={styles.sendButtonContainer}>
                                <button
                                    onClick={sendEvent}
                                    className={styles.sendButton}
                                >
                                    Send
                                </button>
                            </div>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessagePopUp;
