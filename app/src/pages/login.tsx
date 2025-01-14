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
import { getAuth} from "firebase/auth";

const LoginPage = () => {
  const ref = useRef<HTMLFormElement>(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [checkInbox, setCheckInbox] = useState(false);
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
        const user = getAuth().currentUser;
        if (user) {
          user.getIdTokenResult().then((idTokenResult) => {
            const role = idTokenResult.claims.role;
            console.log("User role:", role);
            if (role === "ADMIN") {
              router.push("../admin");
            } else {
              router.push("../dashboard");
            }
          });
        }
      })
      .catch((error) => {
        const code = (error as AuthError).code;
        if (code === "auth/too-many-requests") {
          setFailureMessage(
            "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later."
          );
        } else {
          setFailureMessage("Incorrect email address or password");
        }
        console.log(error);
      });
  };

  useEffect(() => {
    setCheckInbox(false)
  }, [forgotPassword, false]);

  const handleForgotPassword = async () => {
    sendResetEmail(email);
    setCheckInbox(true);
  };

  return (
    <div className={styles.container}>
      {forgotPassword ? (
        <form
          className={`${styles.form} ${styles.forgot}`}
          onSubmit={(e) => {
            e.preventDefault();
            handleForgotPassword();
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
          {checkInbox ? (<div className={styles.checkInbox}><p>Please check your inbox.</p><span onClick={() =>
            setForgotPassword(false)}>
            Return to login.
          </span></div>
          ) : <div></div>}
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
          <div>{failureMessage}</div>
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
