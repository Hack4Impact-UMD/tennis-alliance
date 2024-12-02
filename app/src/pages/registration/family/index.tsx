import { createFamily } from "@/backend/FirestoreCalls";
import TennisBackground from "@/components/tennisBackground";
import { User } from "@/types";
import { useState } from "react";
import styles from "../registration.module.css";

const Family: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [altName, setAltName] = useState<string>("");
  const [altEmail, setAltEmail] = useState<string>("");
  const [notifications, setNotifications] = useState<boolean>(false);
  const [waiver, setWaiver] = useState<boolean>(false);

  const [childFirstName, setChildFirstName] = useState<string>("");
  const [childLastName, setChildLastName] = useState<string>("");
  const [childAge, setChildAge] = useState<number | "">("");
  const [childBirthYear, setChildBirthYear] = useState<number | "">("");
  const [childSchool, setChildSchool] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const children = [
      {
        childFirstName,
        childLastName,
        childAge: Number(childAge),
        childBirthYear: Number(childBirthYear),
        childSchool,
      },
    ];

    createFamily(
      email,
      firstName,
      lastName,
      phone,
      zip,
      notifications,
      waiver,
      children,
      "family",
      altName,
      altEmail,
    )
      .then(() => {
        console.log("Family successfully created");
      })
      .catch((err) => console.error("Error creating family:", err));
  };

  return (
    <div className={styles.container}>
      <TennisBackground
        title="Create a Family Account"
        subtitle="Please fill out the following sections"
      />
      <form onSubmit={handleSubmit}>
        <label id="name">Name used to identify your Family Group</label>
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
        <label htmlFor="email">Family Group Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="phone">Family Group Phone Number</label>
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
        <label htmlFor="other_name">
          Optional: Other name to be associated with your Family Group
          (spouse/guardian)
        </label>
        <input
          id="other_name"
          type="text"
          placeholder="Name"
          value={altName}
          onChange={(e) => setAltName(e.target.value)}
        />

        <label htmlFor="other_email">
          Optional: Other email to be associated with your Family Group
          (spouse/guardian)
        </label>
        <input
          id="other_email"
          type="email"
          placeholder="Email"
          value={altEmail}
          onChange={(e) => setAltEmail(e.target.value)}
        />
        <label id="child1_name">Child Name</label>
        <div>
          <input
            id="child1_first_name"
            aria-labelledby="child1_name"
            type="text"
            placeholder="First Name"
            value={childFirstName}
            onChange={(e) => setChildFirstName(e.target.value)}
            required
          />
          <input
            id="child1_last_name"
            aria-labelledby="child1_name"
            type="text"
            placeholder="Last Name"
            value={childLastName}
            onChange={(e) => setChildLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <div>
            <label htmlFor="child1_age">Child&apos;s Age</label>
            <input
              id="child1_age"
              type="number"
              placeholder="Age"
              value={childAge}
              onChange={(e) => setChildAge(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label htmlFor="child1_year">Child&apos;s Birth Year</label>
            <input
              id="child1_year"
              type="number"
              placeholder="Birth Year"
              value={childBirthYear}
              onChange={(e) => setChildBirthYear(Number(e.target.value))}
              required
            />
          </div>
        </div>
        <label htmlFor="child1_school">Child&apos;s School</label>
        <input
          id="child1_school"
          type="text"
          placeholder="School"
          value={childSchool}
          onChange={(e) => setChildSchool(e.target.value)}
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
      </form>
    </div>
  );
};

export default Family;
