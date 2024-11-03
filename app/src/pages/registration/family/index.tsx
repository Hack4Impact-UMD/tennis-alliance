import { createUser, createUserWithEmailAndPassword } from "@/backend/CloudFunctionsCalls";
import TennisBackground from "@/components/tennisBackground";
import { User, Children } from "@/types";
import { useState } from "react";
import styles from "../registration.module.css";

const Family = () => {
    const [user, setUser] = useState<User>({
        accountType: "family",
        email: "",
        firstName: "",
        lastName: "",
        phone: 0,
        zip: 0,
        notifications: false,
        events: [],
        adults: [],
        children: [],
    });
    let pw = "";
    const [childFields, setChildFields] = useState<Children[]>();
    let counter = 0;

    const handleAddField = () => {
        setChildFields([...childFields, { value: "firstName"+String(counter)}]);
        setChildFields([...childFields, { value: "lasttName"+String(counter)}]);
        setChildFields([...childFields, { value: "age"+String(counter)}]);
        setChildFields([...childFields, { value: "school"+String(counter)}]);
        counter++;
    };

    const handleSubmit = () => {
        console.log(user);
        createUserWithEmailAndPassword(user, pw)
        //createUser(user)
            .then(() => {
                console.log("done");
            })
            .catch((err) => console.log(err));
    };

    function handleChange(e) { 
        const value = e.target.value;
        const name = e.target.id;
        if (name == "password") {
            pw = value;
        }
        else if (name == "adults.name") {
            setUser(prev => ({...prev, ["adults"]: [{["name"]:String(value), ["email"]:user.adults[0].email}]})); 
        }
        else if (name == "adults.email") {
            setUser(prev => ({...prev, ["adults"]: [{["email"]:String(value), ["name"]:user.adults[0].name}]})); 
        }
        else {
            setUser(prev => ({...prev, [name]: value}));
        }
        console.log(user);
    }
    return (
        <div className={styles.container}>
            <TennisBackground
                title="Create a Family Account"
                subtitle="Please fill out the following sections"
            />
            <form>
                <label id="name">Name used to identify your Family Group</label>
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
                <label htmlFor="email">Family Group Email</label>
                <input id="email" type="email" placeholder="Email" onInput={handleChange} required />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="" onInput={handleChange} required />
                <label htmlFor="phone">Family Group Phone Number</label>
                <input id="phone" type="text" placeholder="Phone Number" onInput={handleChange} required />
                <label htmlFor="zip">Zip Code</label>
                <input id="zip" type="text" placeholder="Zip Code" onInput={handleChange} required />
                <label htmlFor="other_name">
                    {/*optional can cause issues*/}
          Optional: Other name to be associated with your Family Group
          (spouse/guardian)
                </label>
                <input id="adults.name" type="text" placeholder="Name" onInput={handleChange}/> 

                <label htmlFor="other_email">
          Optional: Other email to be associated with your Family Group
          (spouse/guardian)
                </label>
                <input id="adults.email" type="email" placeholder="Email" onInput={handleChange}/>
                <label id="child1_name">Child Name</label>
                <div>
                    <input
                        id="child1_first_name"
                        aria-labelledby="child1_name"
                        type="text"
                        placeholder="First Name"
                        onInput={handleChange}
                        required
                    />
                    <input
                        id="child1_last_name"
                        aria-labelledby="child1_name"
                        type="text"
                        placeholder="Last Name"
                        onInput={handleChange}
                        required
                    />
                </div>
                <div>
                    <div>
                        <label htmlFor="child1_age">Child&apos;s Age</label>
                        <input id="child1_age" type="number" placeholder="Age" onInput={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="child1_year">Child&apos;s Birth Year</label>
                        <input
                            id="child1_year"
                            type="number"
                            placeholder="Birth Year"
                            onInput={handleChange}
                            required
                        />
                    </div>
                </div>
                <label htmlFor="child1_school">Child&apos;s School</label>
                <input id="child1_school" type="text" placeholder="School" onInput={handleChange} required />
                <p>Click here to add another child</p>
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
                <label htmlFor="notification">
          Check the box below to receive occasional notifications about upcoming
          events and tennis community news.
                </label>
                <input id="notification" onInput={handleChange} type="checkbox" />
                <button className="button" type="submit" onClick={handleSubmit}>
          Submit
                </button>
            </form>
        </div>
    );
};

export default Family;
