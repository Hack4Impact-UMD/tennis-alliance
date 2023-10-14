import React from 'react';
import styles from './page.module.css'

export default function Volunteer() {
    return (
        <div className={styles.body}>
            <div className={styles.allDivs}>
                <form>
                    <label>Today's date is {}, you've selected {}</label> <br></br><br></br>
                    <div className='w-full flex flex-row'>
                        <label htmlFor='name' > Name </label> <br></br>
                        <div className={styles.textNames}>
                            <input type="text" id="first_name" placeholder=' First' className={styles.individualNames}/>
                            <input type="text" id="last_name" placeholder=' Last'   className={styles.individualNames}/>
                        </div>
                    </div>
                    <div className='w-full flex flex-row'>
                        <label htmlFor='name'> Email </label> <br></br>
                        <input type="text" id="email" className={styles.textbox}/>
                    </div>
                    <div className='w-full flex flex-row'>
                        <label htmlFor='name'> Phone Number </label> <br></br>
                        <input type="text" id="phonenumber" className={styles.textbox}/>
                    </div>
                    
                    <legend>Check all skills that apply: </legend> <br></br>
                    <div className={styles.checkbox}>
                        <input type="checkbox" id="fundraising" name="skill" value="fundraising" />
                        <label htmlFor="fundraising">Fundraising</label>
                    </div>
                    <div className={styles.checkbox}>
                        <input type="checkbox" id="marketing" name="skill" value="marketing" />
                        <label htmlFor="marketing">Marketing</label>
                    </div>
                    <div className={styles.checkbox}>
                        <input type="checkbox" id="event_planning" name="skill" value="event_planning" />
                        <label htmlFor="event_planning">Event Planning</label>
                    </div>
                    <div className={styles.checkbox}>
                        <input type="checkbox" id="other" name="skill" value="other" />
                        <label htmlFor="other">Other</label>
                    </div>
                    <br></br>
                    <div>
                        <label>If other, please specify</label> <br></br>
                        <textarea id={styles.textarea} rows={10} /> 
                        <label>Click <a href="https://drive.google.com/file/d/1RHLryceRPbAGlSQdtRGeT70LWzyrozEa/view" target='_blank'>here</a> to access waiver form</label> <br></br><br></br>
                    </div>
                    
                    <label>Check the box below to agree to the terms and conditions stated in the waiver</label> <br></br> <br></br>
                    <div className={styles.checkbox}>
                        <input type="checkbox" id="terms" value="terms" className={styles.checkbox} />
                        <label htmlFor="terms"/> 
                    </div>
                    <label>Check the box below to receive notifications about upcoming events.</label> <br></br> <br></br>
                    <div className={styles.checkbox}>
                        <input type="checkbox" id="notifs" value="notifs" className={styles.checkbox} />
                        <label htmlFor="notifs"/>
                    </div>
                    <div className={styles.submitLocation}>
                        <button className={styles.submitButton}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

