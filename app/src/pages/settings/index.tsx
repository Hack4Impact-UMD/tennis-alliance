import Image from "next/image";
import ChildForm from "@/components/childForm";
import style from "@/styles/settings.module.css";
import minilogo from "@/assets/minilogo.png";
import profile from "@/assets/profile.png";

const Settings = () => {
    return (
        <form className={style.container}>
            <div className={style.top}>
                <h1>Account</h1>
                <Image src={minilogo} alt="tennis" />
            </div>
            <hr />
            <Image src={profile} alt="profile" priority={false} />
            <h3>Full Name</h3>

            <div className={style.fields}>
                <div>
                    <label htmlFor="firstnamename">First Name</label>
                    <input id="firstname" type="text" placeholder="" required />
                </div>
                <div>
                    <label htmlFor="lastname">Last Name</label>
                    <input id="lastname" type="text" placeholder="" required />
                </div>
            </div>
            <hr />
            <h3>Personal Info</h3>
            <label htmlFor="name">Email</label>
            <input id="email" type="text" className={style.email} />
            <div className={style.fields}>
                <div>
                    <label htmlFor="name">Phone Number</label>
                    <input
                        id="phone"
                        type="text"
                        placeholder=""
                        className={style.phone}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="zip">Zip Code</label>
                    <input id="zip" type="text" placeholder="" required />
                </div>
            </div>
            <hr />
            <h3>Children Info</h3>
            <ChildForm />
            <hr />
            <h3>Additional Info</h3>
            <label>Tell us about your background and interests</label>
            <textarea rows={10} />
            <legend>Check any skills that apply to you:</legend>
            <div className={style.checkbox}>
                <input
                    id="fundraising"
                    type="checkbox"
                    name="skill"
                    value="fundraising"
                />
                <label htmlFor="fundraising">Fundraising</label>
            </div>
            <div className={style.checkbox}>
                <input
                    id="marketing"
                    type="checkbox"
                    name="skill"
                    value="marketing"
                />
                <label htmlFor="marketing">Marketing</label>
            </div>
            <div className={style.checkbox}>
                <input
                    id="event_planning"
                    type="checkbox"
                    name="skill"
                    value="event_planning"
                />
                <label htmlFor="event_planning">Event Planning</label>
            </div>
            <div className={style.checkbox}>
                <input id="other" type="checkbox" name="skill" value="other" />
                <label htmlFor="other">Other</label>
            </div>
            <label>If other, please specify</label>
            <textarea rows={10} required />
            <button>Save</button>
        </form>
    );
};

export default Settings;
