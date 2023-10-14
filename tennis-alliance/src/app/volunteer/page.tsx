import React from 'react';

export default function Volunteer() {
    return (
        <div className="mx-auto max-w-2xl px-4 my-10">

            <form>
                <div className='w-full flex flex-col'>
                    <label htmlFor='name'> Name </label>
                    <input type="text" id="first_name" placeholder='First' />
                    <input type="text" id="last_name" placeholder='Last'/>
                </div>
                <div className='w-full flex flex-col'>
                    <label htmlFor='name'> Email </label>
                    <input type="text" id="email" />
                </div>
                <div className='w-full flex flex-col'>
                    <label htmlFor='name'> Phone Number </label>
                    <input type="text" id="phonenumber" />
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
                <textarea /> 
            </form>
        </div>
    )

}

