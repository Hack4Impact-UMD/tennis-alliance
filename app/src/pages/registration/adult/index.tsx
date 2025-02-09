import { createUser } from "@/backend/CloudFunctionsCalls";
import TennisBackground from "@/components/tennisBackground";
import { useState } from "react";
import styles from "../registration.module.css";

const Adult: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [notifications, setNotifications] = useState<boolean>(false);
  const [waiver, setWaiver] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createUser(email, firstName, lastName, phone, zip, notifications, waiver, "adult")
      .then(() => {
        setSuccessMessage(true); // Show the success message
      })
      .catch((err) => {
        console.error("Error creating user:", err);
      });
    setSuccessMessage(true);
  };

  return (
    <div className={styles.container}>
      <TennisBackground
        title="Create an Adult Account"
        subtitle="Please fill out the following sections"
      />
      <form onSubmit={handleSubmit}>
        <label id="name">Name</label>
        <div>
          <input
            id="first_name"
            aria-labelledby="name"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            id="last_name"
            aria-labelledby="name"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label htmlFor="zip">Zip Code</label>
        <input
          id="zip"
          type="text"
          placeholder="Zip Code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          required
        />
        <p>
          Click{" "}
          <a
            href="https://drive.google.com/file/d/1RHLryceRPbAGlSQdtRGeT70LWzyrozEa/view"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>{" "}
          to access the waiver form
        </p>
        <label htmlFor="waiver">
          Check the box below to agree to the terms and conditions stated in the
          waiver
        </label>
        <input
          id="waiver"
          type="checkbox"
          checked={waiver}
          onChange={(e) => setWaiver(e.target.checked)}
          required
        />
        <label htmlFor="notification">
          Check the box below to receive occasional notifications about upcoming
          events and tennis community news.
        </label>
        <input
          id="notification"
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        <button className="button" type="submit">
          Submit
        </button>
        {successMessage && (
          <div className={styles.successMessage}>
            <div>Please check your inbox to set a password.</div>
            <div>
              Go to <span></span>
              <a href="/login" className={styles.loginLink}>
                login
              </a>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Adult;
