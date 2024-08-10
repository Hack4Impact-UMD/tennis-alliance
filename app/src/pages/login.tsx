import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
// import { authenticateUser } from "@/api/auth";
import circleX from "@/assets/circle_x.png";
import miniLogo from "@/assets/mini_logo.png";
import tennisBalls from "@/assets/tennis_balls.png";
import { authenticateUser, logOut, sendResetEmail } from "@/backend/AuthCalls";
import styles from "@/styles/login.module.css";
import { AuthError } from "firebase/auth";
import { useRouter } from "next/router";

const LoginPage = () => {
  const ref = useRef<HTMLFormElement>(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [email, setEmail] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    logOut();
  }, []);
  useEffect(() => {
    if (ref.current === null) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.width !== width) setWidth(rect.width);
    if (rect.height !== height) setHeight(rect.height);
  }, [ref, width, height]);

  const handleLogin = async () => {
    await authenticateUser(email, password)
      .then(() => {
        router.push("../admin");
      })
      .catch((error) => {
        const code = (error as AuthError).code;
        if (code === "auth/too-many-requests") {
          setFailureMessage(
            "*Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later."
          );
        } else {
          setFailureMessage("*Incorrect email address or password");
        }
        console.log(error);
      });
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    sendResetEmail("randomEmail");
  };

  return (
    <div className={styles.container}>
      {forgotPassword ? (
        <form
          className={`${styles.form} ${styles.forgot}`}
          onSubmit={(e) => {
            e.preventDefault();
            handleForgotPassword(e);
          }}
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
        <form
          ref={ref}
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
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
            <a
              className={styles.signUpLink}
              onClick={() => router.push("../registration")}
            >
              Sign up
            </a>{" "}
            for an account
          </span>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
