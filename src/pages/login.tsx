import { useState } from "react";
import Image from "next/image";
// import { createUser, authenticateUser, logOut } from "@/api/auth";
import ForgotPasswordPopup from "@/components/forgotPasswordPopup";
import styles from "@/styles/page.module.css";
import miniLogo from "@/assets/mini_logo.png";
import tennisBalls from "@/assets/TennisBalls.png";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className={styles.background}>
            <Image className={styles.miniLogo} src={miniLogo} alt="miniLogo" />
            <form className={styles.loginForm}>
                <p className={styles.email}>Email</p>
                <input
                    id="email"
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p className={styles.pw}>Password</p>
                <input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <a
                    href="#"
                    className={styles.forgotPasswordLink}
                    onClick={() => setShowPopup(true)}
                >
                    Forgot password?
                </a>

                {showPopup && (
                    <ForgotPasswordPopup onClose={() => setShowPopup(false)} />
                )}

                <button type="submit" className={styles.button}>
                    <Image
                        className={styles.tennisBalls}
                        src={tennisBalls}
                        alt="tennisBalls"
                    />
                    Submit
                </button>

                <span className={styles.bottomText}>
                    <a href="#" className={styles.signUpLink}>
                        Sign up
                    </a>
                    for an account/One time event
                    <a href="#" className={styles.signUpLink}>
                        sign up
                    </a>
                </span>
            </form>
        </div>
    );
};

export default LoginPage;
