import { useEffect, useState, useRef } from "react";
import Image from "next/image";
// import { createUser, authenticateUser, logOut } from "@/api/auth";
import styles from "@/styles/login.module.css";
import miniLogo from "@/assets/mini_logo.png";
import tennisBalls from "@/assets/tennis_balls.png";
import circleX from "@/assets/circle_x.png";

const LoginPage = () => {
    const ref = useRef(null);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setWidth(ref.current?.clientWidth | 0);
        setHeight(ref.current?.clientHeight | 0);
    }, [ref]);

    return (
        <div className={styles.container}>
            {forgotPassword ? (
                <form
                    className={`${styles.form} ${styles.forgot}`}
                    style={{ width: width, height: height }}
                >
                    <Image src={miniLogo} alt="mini logo" />
                    <Image
                        className={styles.x}
                        src={circleX}
                        alt="x button"
                        onClick={() => setForgotPassword(false)}
                    />
                    <p>Email</p>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">
                        <Image
                            className={styles.tennisBalls}
                            src={tennisBalls}
                            alt="tennisBalls"
                        />
                        Submit
                    </button>
                </form>
            ) : (
                <form className={styles.form} ref={ref}>
                    <Image src={miniLogo} alt="miniLogo" />
                    <p>Email</p>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className={styles.password}>
                        <p>Password</p>
                        <span onClick={() => setForgotPassword(true)}>
                            Forgot password?
                        </span>
                    </div>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">
                        <Image
                            className={styles.tennisBalls}
                            src={tennisBalls}
                            alt="tennisBalls"
                        />
                        Submit
                    </button>
                    <span>
                        <a className={styles.signUpLink}>Sign up</a> for an
                        account/One time event{" "}
                        <a className={styles.signUpLink}>sign up</a>
                    </span>
                </form>
            )}
        </div>
    );
};

export default LoginPage;
