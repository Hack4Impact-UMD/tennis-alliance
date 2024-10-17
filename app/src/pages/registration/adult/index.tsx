import { createUser } from "@/backend/CloudFunctionsCalls";
import TennisBackground from "@/components/tennisBackground";
import { User } from "@/types";
import { SetStateAction, useState } from "react";
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
        console.log(user);
        createUser(user)
            .then(() => {
                console.log("done");
            })
            .catch((err) => console.log(err));
    };

    function handleChange(e) { 
        const value = e.target.value;
        const name = e.target.id;
        setUser(prev => ({...prev, [name]: value}));
    }
    return (
        <div className={styles.container}>
            <TennisBackground
                title="Create an Adult Account"
                subtitle="Please fill out the following sections"
            />
            <form id="form" onSubmit={handleSubmit}>
                <label id="name">Name</label>
                <div>
                    <input
                        id="firstName"
                        aria-labelledby="name"
                        type="text"
                        placeholder="First Name"
                        onInput={handleChange}
                        required
                    />
                    <input
                        id="lastName"
                        aria-labelledby="name"
                        type="text"
                        placeholder="Last Name"
                        onInput={handleChange}
                        required
                    />
                </div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="Email" onInput={handleChange} required />
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" type="text" placeholder="Phone Number" onInput={handleChange} required />
                <label htmlFor="zip">Zip Code</label>
                <input id="zip" type="text" placeholder="Zip Code" onInput={handleChange} required />
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
                <input id="waiver" type="checkbox" onInput={handleChange} required />
                <label htmlFor="notifications">
          Check the box below to receive occasional notifications about upcoming
          events and tennis community news.
                </label>
                <input id="notifications" onInput={handleChange} type="checkbox" />
                <button className="button" type="submit">
          Submit
                </button>
            </form>
        </div>
    );
};

export default Adult;
