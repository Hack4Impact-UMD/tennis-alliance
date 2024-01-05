import React from "react";
import Image from "next/image";
import styles from "@/styles/page.module.css";
import tennisBalls from "@/assets/TennisBalls.png";
import circledX from "@/assets/Circled_X.png";

type ForgotPasswordPopupProps = {
    onClose: () => void;
}

const ForgotPasswordPopup = (prop: ForgotPasswordPopupProps) => {
    return (
        <div className={styles.popupBackground}>
            <div className={styles.popupBox}>
                <button onClick={prop.onClose} className={styles.closeButton}>
                    <Image 
                        className={styles.circledX} 
                        src={circledX} 
                        alt="close" 
                    />
                </button>

                <p className={styles.pwPopupTitle}>Input Email</p>
                <input 
                    type="email" 
                    placeholder="email address here"
                    className={styles.emailInput}
                />
                <button type="submit" className={styles.pwSubmitButton}>
                    <Image 
                        className={styles.tennisBalls} 
                        src={tennisBalls} 
                        alt="tennisBalls" 
                    />
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordPopup;
