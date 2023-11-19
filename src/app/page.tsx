"use client";
import Image from "next/image";
import style from "./page.module.css";
import submitting, { createUser } from "../api/auth";
import { user } from "../api/test";
import {useState} from "react";
import {
    signInWithEmailAndPassword
} from "firebase/auth";
import {auth} from "../config";


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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <main className={style.main}>
            <div className={style.description}>
                
                <div>
                    
                    <button
                        onClick={() => createUser(user)}
                    >
                        CLICK ME
                    </button>
                    <br/>
                    <form>
                        <div className={style.personal}>
                        <label htmlFor='email'>Email</label>
                        <br />
                        <input
                            type="text"
                            id="email"
                            onChange={(event) => setEmail(event.target.value)}
                            className={style.textbox}
                            required
                        />
                        <br />
                        <div className={style.textNames}>
                            <div className={style.nameTitles}>
                            <label htmlFor='password'>Password</label>
                            <br />
                            <input
                                type="password"
                                id="password"
                                onChange={(event) => setPassword(event.target.value)}
                                className={style.phone}
                                required
                            />
                            </div>
                        </div>
                        </div>

                        <div className={style.submitLocation}>
                        <button type="button" onClick={() => submitting(email, password)} className={style.submitButton}>
                            Submit
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
