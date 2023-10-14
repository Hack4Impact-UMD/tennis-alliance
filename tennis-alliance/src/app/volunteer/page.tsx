import React from 'react';
import styles from './page.module.css'
export default function Volunteer() {
    return (
        <div className={styles.body}>
            <form>
                <div className='w-full flex flex-col'>
                    <label htmlFor='name'> Name </label> <br></br>
                    <input type="text" id="first_name" placeholder='First' className={styles.textbox}/>
                    <input type="text" id="last_name" placeholder='Last'   className={styles.textbox}/>
                </div>
                <div className='w-full flex flex-col'>
                    <label htmlFor='name'> Email </label> <br></br>
                    <input type="text" id="email" className={styles.textbox}/>
                </div>
                <div className='w-full flex flex-col'>
                    <label htmlFor='name'> Phone Number </label> <br></br>
                    <input type="text" id="phonenumber" className={styles.textbox}/>
                </div>
                 
                <legend>Check all skills that apply: </legend>
                <div>
                    <input type="checkbox" id="fundraising" name="skill" value="fundraising" />
                    <label htmlFor="fundraising">Fundraising</label>
                </div>
                <div>
                    <input type="checkbox" id="marketing" name="skill" value="marketing" />
                    <label htmlFor="marketing">Marketing</label>
                </div>
                <div>
                    <input type="checkbox" id="event_planning" name="skill" value="event_planning" />
                    <label htmlFor="event_planning">Event Planning</label>
                </div>
                <div>
                    <input type="checkbox" id="other" name="skill" value="other" />
                    <label htmlFor="other">Other</label>
                </div>

                <div>
                    <input type="checkbox" id="other" name="skill" value="other" />
                    <label htmlFor="other">Other</label>
                </div>
                <div>
                    <label>If other, please specify</label> <br></br>
                    <textarea rows={6} /> 
                </div>
            </form>
        </div>
    )

}

