import style from "@/styles/home.module.css";
import { createUser, authenticateUser, logOut } from "../api/auth";
import { user } from "../api/test";
import { useState } from "react";

const Home = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
