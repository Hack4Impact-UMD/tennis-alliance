import editButton from "@/assets/pen.png";
import exitButton from "@/assets/exit.png"
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
  const [isEditing, setIsEditing] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
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

  const handleInputChange = (field: keyof User, value: string) => {
    setUser((prevUser) => prevUser ? { ...prevUser, [field]: value } : prevUser);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  }

  const handleCheckboxChange = () => {
    setIsOtherSelected(!isOtherSelected);
  };

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
          <form className={style.container}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
            <div className={style.top}>
              <h1>Account</h1>
              <div className={style.buttonIcon}>
                <Image
                  src={isEditing ? exitButton : editButton}
                  onClick={handleEditToggle}
                  alt={isEditing ? "exit" : "edit"} />
              </div>
            </div>
            <hr />
            <h3>Full Name</h3>
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
                <input
                  id="firstname"
                  type="text"
                  value={user?.firstName || ""}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required />
              </div>
              <div>
                <label htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  type="text"
                  value={user?.lastName || ""}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required />
              </div>
            </div>
            <hr />
            <h3>Personal Info</h3>
            <label htmlFor="name">Email</label>
            <input
              id="email"
              type="text"
              className={style.email}
              value={user?.email || ""}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("email", e.target.value)} />
            <button
              type="button"
              className={style.save}
              onClick={() => setOpenChangePasswordModal(true)}
            >
              click me change password
            </button>
            <div className={style.fields}>
              <div>
                <label htmlFor="name">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  value={user?.phone || ""}
                  className={style.phone}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="zip">Zip Code</label>
                <input
                  id="zip"
                  type="text"
                  value={user?.zip || ""}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  required />
              </div>
            </div>
            <hr />
            <h3>Children Info</h3>
            <ChildForm isEditing={isEditing} />
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
              <input id="other" type="checkbox" name="skill" value="other" onClick={handleCheckboxChange} />
              <label htmlFor="other">Other</label>
            </div>
            {isOtherSelected && (
              <div>
                <label>If other, please specify</label>
                <textarea rows={10} required />
              </div>
            )}
            <button>Save</button>
          </form>
        </>
      )}
    </RequireAuth>
  );
};

export default Settings;
