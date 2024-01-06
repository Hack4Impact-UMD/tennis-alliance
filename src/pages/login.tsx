import { useEffect, useState, useRef, FormEvent } from "react";
import Image from "next/image";
// import { authenticateUser } from "@/api/auth";
import styles from "@/styles/login.module.css";
import miniLogo from "@/assets/mini_logo.png";
import tennisBalls from "@/assets/tennis_balls.png";
import circleX from "@/assets/circle_x.png";

const LoginPage = () => {
    const ref = useRef<HTMLFormElement>(null);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (ref.current === null) return;
        const rect = ref.current.getBoundingClientRect();
        if (rect.width !== width) setWidth(rect.width);
        if (rect.height !== height) setHeight(rect.height);
    }, [ref, width, height]);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("login");
        console.log(email, password);
        // authenticateUser(email, password);
    };

    const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("forgot password");
    };

    return (
        <div className={styles.container}>
            {forgotPassword ? (
                <form
                    className={`${styles.form} ${styles.forgot}`}
                    onSubmit={(e) => handleForgotPassword(e)}
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
                <form ref={ref} className={styles.form} onSubmit={handleLogin}>
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
