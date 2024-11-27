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
  const [children, setChildren] = useState<
    { childFirstName: string; childLastName: string; childAge: number | ""; childBirthYear: number | ""; childSchool: string }[]
  >([
    {
      childFirstName: "",
      childLastName: "",
      childAge: "",
      childBirthYear: "",
      childSchool: "",
    },
  ]);

  const handleChildChange = (index: number, field: string, value: string | number) => {
    const updatedChildren = [...children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    };
    setChildren(updatedChildren);
  };

  const addChild = () => {
    setChildren([
      ...children,
      {
        childFirstName: "",
        childLastName: "",
        childAge: "",
        childBirthYear: "",
        childSchool: "",
      },
    ]);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, childIndex) => childIndex !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    createFamily(
      email,
      firstName,
      lastName,
      phone,
      zip,
      notifications,
      waiver,
      children.map((child) => ({
        ...child,
        childAge: Number(child.childAge),
        childBirthYear: Number(child.childBirthYear),
      })), // Use the `children` state
      "family",
      altName,
      altEmail
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
        {children.map((child, index) => (
          <div key={index}>
            <label id={`child${index}_name`}>Child Name</label>
            <div>
              <input
                id={`child${index}_first_name`}
                aria-labelledby={`child${index}_name`}
                type="text"
                placeholder="First Name"
                value={child.childFirstName}
                onChange={(e) => handleChildChange(index, "childFirstName", e.target.value)}
                required
              />
              <input
                id={`child${index}_last_name`}
                aria-labelledby={`child${index}_name`}
                type="text"
                placeholder="Last Name"
                value={child.childLastName}
                onChange={(e) => handleChildChange(index, "childLastName", e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor={`child${index}_age`}>Child&apos;s Age</label>
              <input
                id={`child${index}_age`}
                type="number"
                placeholder="Age"
                value={child.childAge}
                onChange={(e) => handleChildChange(index, "childAge", Number(e.target.value))}
                required
              />
              <label htmlFor={`child${index}_year`}>Child&apos;s Birth Year</label>
              <input
                id={`child${index}_year`}
                type="number"
                placeholder="Birth Year"
                value={child.childBirthYear}
                onChange={(e) => handleChildChange(index, "childBirthYear", Number(e.target.value))}
                required
              />
            </div>
            <label htmlFor={`child${index}_school`}>Child&apos;s School</label>
            <input
              id={`child${index}_school`}
              type="text"
              placeholder="School"
              value={child.childSchool}
              onChange={(e) => handleChildChange(index, "childSchool", e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => removeChild(index)}
              aria-label={`Remove Child ${index + 1}`}
              style={{ color: "red", height: "50px" }}
            >
              Remove Child
            </button>
          </div>
        ))}

        <button type="button" onClick={addChild}>
          Add Another Child
        </button>
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
