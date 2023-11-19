import Image from "next/image";
import React from 'react';
import style from "../../styles/settings.module.css";
import tennis from "../settings/images/tennispic.png";
import profile from "../settings/images/Vector.png";
import "./images/evaEmailFill2.png";
import Children from "./addremove";

export default function Settings() {
    console.log("Current working directory:", process.cwd());

    return (
        <div className={style.body}>
            <div className={style.allDivs}>
                <form>
                    <div className={style.top}>
                        <div className={style.accHead}>
                            <h3>Account</h3>
                        </div>
                        <Image src={tennis} alt="tennis"/>
                    </div>
                    
                    <br/>
                    <hr className={style.hhhr}></hr>
                    <br/>

                    <Image src={profile} alt="profile" priority={false}/>
                    <br/>
                    <br/>
                    <h3>Full Name</h3>
                    <br/>

                    <div className={style.textNames}>
                        <div className={style.nameTitles}>
                            <label htmlFor='name' > First Name </label> <br/>
                            <input type="text" id="first_name" placeholder='' className={style.individualNames} required/>
                        </div>
                        <div className={style.nameTitles}>
                            <label htmlFor='name' > Last Name </label> <br/>
                            <input type="text" id="last_name" placeholder=''   className={style.individualNames} required/>
                        </div>
                    </div>  
                    <br/>
                    <hr className={style.hhhr}></hr>
                    <br/>
                    <h3>Personal Info</h3>
                    <br/>

                    <div className={style.personal}>
                        <label htmlFor='name'> Email </label> <br/>
                        <input type="text" id="email" className={style.textbox}/>
                        <br></br>
                        <div className={style.textNames}>
                            <div className={style.nameTitles}>
                                <label htmlFor='name' > Phone Number </label> <br/>
                                <input type="text" id="phone" placeholder='' className={style.phone} required/>
                            </div>
                            <div className={style.numTitles}>
                                <label htmlFor='name' > Zip Code </label> <br/>
                                <input type="text" id="zip" placeholder=''   className={style.zip} required/>
                            </div>
                        </div>   
                    </div>

                    <br/>
                    <hr className={style.hhhr}></hr>
                    <br/>
                    <h3>Children Info</h3>

                    <Children/>
                    
                    <hr className={style.hhhr}></hr>
                    <br/>
                    <h3>Additional Info</h3>
                    <br/>

                    <div>
                        <label>Tell us about your background and interests</label> <br/>
                        <textarea id={style.textarea} rows={10} required/> 
                    </div>

                    <br/>
                    <legend>Check any skills that apply to you: </legend> <br/>
                    <div className={style.checkbox}>
                        <input type="checkbox" id="fundraising" name="skill" value="fundraising" />
                        <label htmlFor="fundraising">Fundraising</label>
                    </div>
                    <div className={style.checkbox}>
                        <input type="checkbox" id="marketing" name="skill" value="marketing" />
                        <label htmlFor="marketing">Marketing</label>
                    </div>
                    <div className={style.checkbox}>
                        <input type="checkbox" id="event_planning" name="skill" value="event_planning" />
                        <label htmlFor="event_planning">Event Planning</label>
                    </div>
                    <div className={style.checkbox}>
                        <input type="checkbox" id="other" name="skill" value="other" />
                        <label htmlFor="other">Other</label>
                    </div>
                    
                    <br/>

                    <div className={style.submitLocation}>
                        <button className={style.submitButton}>SAVE</button>
                        <br/>
                    </div>
                    

                </form>
            </div>
        </div>
    );
}

function useState(arg0: number): [any, any] {
    throw new Error("Function not implemented.");
}
