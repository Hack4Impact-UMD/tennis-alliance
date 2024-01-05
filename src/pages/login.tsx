import React, { useState } from "react";
import Image from "next/image";
import ForgotPasswordPopup from "@/pages/forgotPasswordPopup";
import styles from "@/styles/page.module.css";
import miniLogo from "@/assets/mini_logo.png";
import tennisBalls from "@/assets/TennisBalls.png";

const LoginPage = () => {
    const [showPopup, setShowPopup] = useState(false);

    const openPopup = () => setShowPopup(true);
    const closePopup = () => setShowPopup(false);

    return (
        <div className={styles.background}>
            <Image className={styles.miniLogo} src={miniLogo} alt="miniLogo" />
            <form className={styles.loginForm}>
                <p className={styles.email}>Email</p>
                <input type="email" className={styles.inputBox} required/>
                <p className={styles.pw}>Password</p>
                <input type="password" className={styles.inputBox} required />

                <a href="#" className={styles.forgotPasswordLink} onClick={openPopup}>Forgot password?</a>

                {showPopup && 
                    <ForgotPasswordPopup onClose={closePopup} />
                }

                <button type="submit" className={styles.button}>
                    <Image className={styles.tennisBalls} src={tennisBalls} alt="tennisBalls" />Submit
                </button>

                <span className={styles.bottomText}>
                    <a href="#" className={styles.signUpLink}>Sign up</a> for an account/One time event <a href="#" className={styles.signUpLink}>sign up</a>
                </span>
            </form>
        </div>
    );
};


export default LoginPage;


