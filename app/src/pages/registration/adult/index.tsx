import { createUser } from "@/backend/CloudFunctionsCalls";
import TennisBackground from "@/components/tennisBackground";
import { User } from "@/types";
import { useState } from "react";
import styles from "../registration.module.css";

const Adult = () => {
  const [user, setUser] = useState<User>({
    email: "",
    firstName: "",
    lastName: "",
    phone: 0,
    zip: 0,
    notifications: false,
    events: [],
  });
  const handleSubmit = () => {
    createUser(user)
      .then(() => {
        console.log("done");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={styles.container}>
      <TennisBackground
        title="Create an Adult Account"
        subtitle="Please fill out the following sections"
      />
      <form>
        <label id="name">Name</label>
        <div>
          <input
            id="first_name"
            aria-labelledby="name"
            type="text"
            placeholder="First Name"
            required
          />
          <input
            id="last_name"
            aria-labelledby="name"
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="Email" required />
        <label htmlFor="phone">Phone Number</label>
        <input id="phone" type="text" placeholder="Phone Number" required />
        <label htmlFor="zip">Zip Code</label>
        <input id="zip" type="text" placeholder="Zip Code" required />
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
        <input id="waiver" type="checkbox" required />
        <label htmlFor="notification">
          Check the box below to receive occasional notifications about upcoming
          events and tennis community news.
        </label>
        <input id="notification" type="checkbox" />
        <button className="button" type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Adult;
