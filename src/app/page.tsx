"use client";
import Image from "next/image";
import style from "./page.module.css";
import {
    createUser,
    authenticateUser,
    logOut,
    monitorAuthState,
} from "../api/auth";
import { user } from "../api/test";
import { useEffect, useState } from "react";

// const user = {
//     uid: 1101,
//     newEmail: "person@gmail.com",
//     password: createHash,
//     newFirstName: "John",
//     newLastName: "Doe",
//     phoneNumber: "1234567890",
//     zipCode: "20001",
//     children: [{
//       firstName: "Jane",
//       lastName: "Doe",
//       age: 12,
//       birthYear: 2011,
//       school: "Elementary School",
//     }],
//     notifcations: false,
//   }

const Home = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <main className={style.main}>
            <div className={style.description}>
                <div>
                    <button onClick={() => createUser(user)}>CLICK ME</button>
                    <br />
                    <form>
                        <div className={style.personal}>
                            <label htmlFor="email">Email</label>
                            <br />
                            <input
                                type="text"
                                id="email"
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                className={style.textbox}
                                required
                            />
                            <br />
                            <div className={style.textNames}>
                                <div className={style.nameTitles}>
                                    <label htmlFor="password">Password</label>
                                    <br />
                                    <input
                                        type="password"
                                        id="password"
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        className={style.phone}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={style.submitLocation}>
                            <button
                                type="button"
                                onClick={() => {
                                    authenticateUser(email, password);
                                    setLoggedIn(true);
                                }}
                                className={style.submitButton}
                            >
                                Log In
                            </button>
                            <br />
                            <button
                                type="button"
                                onClick={() => {
                                    logOut();
                                    setLoggedIn(false);
                                }}
                                className={style.submitButton}
                            >
                                Sign Out
                            </button>
                            <br />
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Home;
