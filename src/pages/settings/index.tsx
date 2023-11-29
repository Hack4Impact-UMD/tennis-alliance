import Image from "next/image";
import React from 'react';
import style from "../../styles/settings.module.css";
import tennis from "../../assets/tennispic.png";
import profile from "../../assets/Vector.png";
import Children from "./addremove";

export default function Settings() {

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
                    
                    <hr className={style.hhhr}></hr>
                    

                    <Image src={profile} alt="profile" priority={false}/>
                    
                    <h3 className={style.additional}>Full Name</h3>
                    

                    <div className={style.textNames}>
                        <div className={style.nameTitles}>
                            <label htmlFor='name' > First Name </label>
                            <input type="text" id="first_name" placeholder='' className={style.individualNames} required/>
                        </div>
                        <div className={style.nameTitles}>
                            <label htmlFor='name' > Last Name </label>
                            <input type="text" id="last_name" placeholder=''   className={style.individualNames} required/>
                        </div>
                    </div>  
                    <hr className={style.hhhr}></hr>
                    <h3>Personal Info</h3>

                    <div className={style.personal}>
                        <label htmlFor='name'> Email </label>
                        <input type="text" id="email" className={style.textbox}/>
                        <div className={style.textNames}>
                            <div className={style.nameTitles}>
                                <label htmlFor='name' > Phone Number </label>
                                <input type="text" id="phone" placeholder='' className={style.phone} required/>
                            </div>
                            <div className={style.numTitles}>
                                <label htmlFor='name' > Zip Code </label>
                                <input type="text" id="zip" placeholder=''   className={style.individualNames} required/>
                            </div>
                        </div>   
                    </div>

                    <hr className={style.hhhr}></hr>
                    <h3>Children Info</h3>

                    <Children/>
                    
                    <hr className={style.hhhr}></hr>
                    <h3>Additional Info</h3>

                    <div className={style.additional}>
                        <label>Tell us about your background and interests</label> 
                        <textarea id={style.textarea} rows={10}/> 
                    </div>

                    <legend>Check any skills that apply to you: </legend>
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
                    <div>
                        <label>If other, please specify</label> 
                        <textarea id={style.textarea} rows={10} required/> 
                    </div>

                    <div className={style.submitLocation}>
                        <button className={style.submitButton}>SAVE</button>
                    </div>
                    

                </form>
            </div>
        </div>
    );
}
