import React from "react";
import Image from "next/image";
import styles from "@/styles/page.module.css";
import miniLogo from "@/assets/mini_logo.png";
import tennisBalls from "@/assets/TennisBalls.png";

const LoginPage = () => {
    return (
        <div className={styles.background}>
            <Image className={styles.miniLogo} src={miniLogo} alt="miniLogo" />
            <form className={styles.loginForm}>
                <p className={styles.email}>Email</p>
                <input type="email" className={styles.inputBox} required/>
                <p className={styles.pw}>Password</p>
                <input type="password" className={styles.inputBox} required />

                <a href="#" className={styles.forgotPasswordLink}>Forgot password?</a>

                <div className={styles.align}>
                    <button className={styles.button}>
                        <Image className={styles.tennisBalls} src={tennisBalls} alt="tennisBalls" />Submit
                    </button>
                </div>

                <span className={styles.bottomText}>
                    <a href="#" className={styles.signUpLink}>Sign up</a> for an account/One time event <a href="#" className={styles.signUpLink}>sign up</a>
                </span>
            </form>
        </div>
    );
};


export default LoginPage;


