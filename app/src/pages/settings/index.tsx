import editButton from "@/assets/pen.png";
import profile from "@/assets/profile.png";
import { useAuth } from "@/auth/AuthProvider";
import RequireAuth from "@/auth/RequireAuth/RequireAuth";
import { getUserWithId, updateUser } from "@/backend/FirestoreCalls";
import ChildForm from "@/components/childForm";
import Loading from "@/components/LoadingScreen/Loading";
import style from "@/styles/settings.module.css";
import { User } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import ChangeEmail from "./ChangeEmail/ChangeEmail";
import ChangePassword from "./ChangePassword/ChangePassword";

const Settings = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [openChangeEmailModal, setOpenChangeEmailModal] =
    useState<boolean>(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] =
    useState<boolean>(false);
  const authContext = useAuth();

  // On page load, fetch the user
  useEffect(() => {
    if (
      (!authContext.loading &&
        authContext?.token?.claims.role?.toString().toUpperCase() == "ADMIN") ||
      authContext?.token?.claims.role?.toString().toUpperCase() == "USER"
    ) {
      getUserWithId(authContext.user.uid)
        .then((user) => {
          setUser(user);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [authContext.loading]);

  const handleSubmit = () => {
    // Once the form is filled just use this to change the user in the backend
    updateUser(user!)
      .then(() => console.log("done"))
      .catch((err) => console.log(err));
  };
  return (
    <RequireAuth>
      {loading ? (
        <Loading />
      ) : (
        <>
          {" "}
          <ChangeEmail
            open={openChangeEmailModal}
            handleClose={() => setOpenChangeEmailModal(false)}
          />
          <ChangePassword
            open={openChangePasswordModal}
            handleClose={() => setOpenChangePasswordModal(false)}
          />
          <form className={style.container}>
            <div className={style.top}>
              <h1>Account</h1>
              <Image src={editButton} alt="pencil" />
            </div>
            <hr />
            <h3>Full Name</h3>
            <button
              className={style.save}
              onClick={() => setOpenChangePasswordModal(true)}
            >
              click me change password
            </button>
            {/* <button
              className={style.save}
              onClick={() => setOpenChangeEmailModal(true)}
            >
              click me to change email
            </button> */}
            {/* <button className={style.save} onClick={() => handleSubmit()}>
              click me to change email2
            </button> */}

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
        </>
      )}
    </RequireAuth>
  );
};

export default Settings;
