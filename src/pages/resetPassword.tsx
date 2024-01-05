import React from "react";
import styles from "@/styles/page.module.css";

const ResetPassword = () => {
    return (
        <div className={styles.background}>
            <p className={styles.title}>Reset Password</p>
            <form className={styles.resetForm}>
                <p className={styles.resetTitle}>New Password</p>
                <input className={styles.resetInput} type="password" required/>
                <p className={styles.resetTitle}>Re-enter New Password</p>
                <input className={styles.resetInput} type="password" required />

                <button className={styles.button}>Submit</button>
            </form>
        </div>
    );
};

export default ResetPassword;
