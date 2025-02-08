import editButton from "@/assets/pen.png";
import exitButton from "@/assets/exit.png"
import { useAuth } from "@/auth/AuthProvider";
import RequireAuth from "@/auth/RequireAuth/RequireAuth";
import { getUserWithId, updateUser, getAdditionalInfo, updateAdditionalInfo, updateChildren } from "@/backend/FirestoreCalls";
import ChildForm from "@/components/childForm";
import Loading from "@/components/LoadingScreen/Loading";
import style from "@/styles/settings.module.css";
import { User, ChildrenWithId } from "@/types";
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
  const [isFamilyAccount, setIsFamilyAccount] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({
    backgroundAndInterests: "",
    skills: [] as string[],
    otherDetails: "",
  });
  const [childrenData, setChildrenData] = useState<ChildrenWithId[]>([]);
  const authContext = useAuth();
  const maxBackgroundLength = 250;
  const maxOtherDetailsLength = 100;

  // On page load, fetch the user
  useEffect(() => {
    const fetchUserData = async () => {
      if (
        (!authContext.loading &&
          authContext?.token?.claims.role?.toString().toUpperCase() == "ADMIN") ||
        authContext?.token?.claims.role?.toString().toUpperCase() == "USER"
      ) {
        try {
          const user = await getUserWithId(authContext.user.uid)
          setUser(user);
          if (user.type === "family")
            setIsFamilyAccount(true);
          // Fetches the user's additional info from Firebase
          const fetchedAdditionalInfo = await getAdditionalInfo(authContext.user.uid);
          // Sets default values of additional info to values obtained from database if they exist
          setAdditionalInfo({
            backgroundAndInterests: fetchedAdditionalInfo?.backgroundAndInterests || "",
            skills: fetchedAdditionalInfo?.skills || [],
            otherDetails: fetchedAdditionalInfo?.otherDetails || ""
          });

          if (fetchedAdditionalInfo?.skills.includes("other"))
            setIsOtherSelected(true);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [authContext.loading]);

  // Takes the most updated state of the user and updates the chosen User field with 
  // the passed in value. Otherwise, it remains the same
  const handleInputChange = (field: keyof User, value: string) => {
    setUser((prevUser) => prevUser ? { ...prevUser, [field]: value } : prevUser);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  }

  // Takes the most updated state of the User's additionalInfo and updates the chosen additionalInfo field with 
  // the passed in value
  const handleAdditionalInfoChange = (field: keyof typeof additionalInfo, value: string) => {
    setAdditionalInfo((prevInfo) => ({ ...prevInfo, [field]: value }));
  };

  // Filters out the skills that are unchecked, includes the ones that are checked
  const handleSkillCheckboxChange = (skill: string) => {
    setAdditionalInfo((prevInfo) => {
      const newSkills = prevInfo.skills.includes(skill)
        ? prevInfo.skills.filter((s) => s !== skill)
        : [...prevInfo.skills, skill];

      // Determine if "Other" checkbox is selected
      const isOtherSelected = newSkills.includes("other");

      // Update isOtherSelected state and additionalInfo
      setIsOtherSelected(isOtherSelected);

      return {
        ...prevInfo,
        skills: newSkills,
        otherDetails: !isOtherSelected ? "" : prevInfo.otherDetails, // Clear "otherDetails" if "Other" is unchecked
      };
    });
  };

  // Share state change with child component `childForm.tsx`
  const handleChildrenChange = (updatedChildren: ChildrenWithId[]) => {
    setChildrenData(updatedChildren);
  };

  const handleSubmit = () => {
    const uid = authContext.user.uid;

    // Create a new array without the `childId` property to keep childId local
    const childrenDataWithoutId = childrenData.map(({ childId, ...rest }) => rest);

    Promise.all([
      updateUser(user!),
      updateAdditionalInfo(uid, additionalInfo),
      updateChildren(uid, childrenDataWithoutId)
    ])
      .then(() => {
        console.log("done")
        window.location.reload();
      })
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
              Change password
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
            {isFamilyAccount && (
              <div>
                <h3>Children Info</h3>
                <ChildForm
                  isEditing={isEditing}
                  userId={authContext.user.uid}
                  onChildrenChange={handleChildrenChange} />
                <hr />
              </div>
            )}
            <h3>Additional Info</h3>
            <label>Tell us about your background and interests</label>
            <textarea
              rows={10}
              maxLength={maxBackgroundLength}
              onChange={(e) => handleAdditionalInfoChange("backgroundAndInterests", e.target.value)}
              value={additionalInfo.backgroundAndInterests} />
            <p>{additionalInfo.backgroundAndInterests.length}/{maxBackgroundLength} characters</p>
            <legend>Check any skills that apply to you:</legend>
            <div className={style.checkbox}>
              <input
                id="fundraising"
                type="checkbox"
                name="skill"
                value="fundraising"
                checked={additionalInfo.skills.includes("fundraising")}
                onChange={() => handleSkillCheckboxChange("fundraising")}
              />
              <label htmlFor="fundraising">Fundraising</label>
            </div>
            <div className={style.checkbox}>
              <input
                id="marketing"
                type="checkbox"
                name="skill"
                value="marketing"
                checked={additionalInfo.skills.includes("marketing")}
                onChange={() => handleSkillCheckboxChange("marketing")}
              />
              <label htmlFor="marketing">Marketing</label>
            </div>
            <div className={style.checkbox}>
              <input
                id="event_planning"
                type="checkbox"
                name="skill"
                value="event_planning"
                checked={additionalInfo.skills.includes("event_planning")}
                onChange={() => handleSkillCheckboxChange("event_planning")}
              />
              <label htmlFor="event_planning">Event Planning</label>
            </div>
            <div className={style.checkbox}>
              <input
                id="other"
                type="checkbox"
                name="skill"
                value="other"
                checked={additionalInfo.skills.includes("other")}
                onChange={() => handleSkillCheckboxChange("other")} />
              <label htmlFor="other">Other</label>
            </div>
            {isOtherSelected && (
              <div>
                <label>If other, please specify</label>
                <textarea
                  rows={10}
                  maxLength={maxOtherDetailsLength}
                  onChange={(e) => handleAdditionalInfoChange("otherDetails", e.target.value)}
                  value={additionalInfo.otherDetails}
                  required />
                <p>{additionalInfo.otherDetails.length}/{maxOtherDetailsLength} characters</p>
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
