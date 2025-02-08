import { useEffect, useState } from "react";
import { ChildrenWithId } from "@/types";
import Image from "next/image";
import style from "@/styles/settings.module.css";
import plus from "@/assets/plus.png";
import minus from "@/assets/minus.png";
import { getChildren } from "@/backend/FirestoreCalls";

interface ChildFormProps {
    isEditing: boolean;
    userId: string;
    onChildrenChange: (children: ChildrenWithId[]) => void
}

const ChildForm = ({ isEditing, userId, onChildrenChange }: ChildFormProps) => {
    const [childrenData, setChildrenData] = useState<ChildrenWithId[]>([]);

    // Fetches children data on the initial load of the page
    useEffect(() => {
        const fetchChildrenData = async () => {
            try {
                const children = await getChildren(userId);
                const updatedChildren = children.map((child, index) => ({
                    ...child,
                    childId: index, // Assign childId based on index
                }));
                setChildrenData(updatedChildren);
                onChildrenChange(updatedChildren); // Notifies parent on initial children state
            } catch (error) {
                console.log("Error fetching children's data:", error);
            }
        }
        fetchChildrenData();
    }, [userId])

    useEffect(() => {
        onChildrenChange(childrenData); // Sync with parent on childrenData updates
    }, [childrenData, onChildrenChange]);

    const addChild = () => {
        const newChild: ChildrenWithId = {
            childId: childrenData.length, // Assign the next available ID
            childFirstName: "",
            childLastName: "",
            childAge: 0,
            childBirthYear: 0,
            childSchool: "",
        };

        setChildrenData((prev) => [...prev, newChild]); // Add new child and update the state
    };

    const removeChild = (idToRemove: number) => {
        setChildrenData((prevChildren) => {
            if (prevChildren.length > 1) {
                // Filter out the child with the specified ID
                return prevChildren.filter((child) => child.childId !== idToRemove);
            }
            // Return the previous state if no removal should happen
            return prevChildren;
        });
    };

    const handleFieldChange = (
        field: keyof ChildrenWithId,
        childId: number,
        value: string
    ) => {
        setChildrenData((prev) => {
            // Maps through each child within the most recent state of childrenData
            // and checks if the child's id matches
            const updated = prev.map((child) =>
                child.childId === childId
                    ? { ...child, [field]: value } // Update the specific field
                    : child
            );

            return updated; // Return the updated state
        });
    };

    return (
        <div>
            {childrenData.map((child) => (
                <div key={child.childId} className={style.child}>
                    <div className={style.fields}>
                        <div>
                            <label htmlFor={`first_name_${child.childId}`}>
                                First Name
                            </label>
                            <input
                                id={`first_name_${child.childId}`}
                                type="text"
                                value={child?.childFirstName || ""}
                                className={style.individualNames}
                                disabled={!isEditing}
                                onChange={(e) => handleFieldChange("childFirstName", child.childId, e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor={`last_name_${child.childId}`}>
                                Last Name
                            </label>
                            <input
                                id={`last_name_${child.childId}`}
                                type="text"
                                value={child?.childLastName || ""}
                                className={style.individualNames}
                                disabled={!isEditing}
                                onChange={(e) => handleFieldChange("childLastName", child.childId, e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={style.fields}>
                        <div>
                            <label htmlFor={`age_${child.childId}`}>
                                Age
                            </label>
                            <input
                                id={`age_${child.childId}`}
                                type="text"
                                value={child?.childAge || ""}
                                className={style.individualNames}
                                disabled={!isEditing}
                                onChange={(e) => handleFieldChange("childAge", child.childId, e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor={`birth_year_${child.childId}`}>
                                Birth Year
                            </label>
                            <input
                                id={`birth_year_${child.childId}`}
                                type="text"
                                value={child?.childBirthYear || ""}
                                className={style.individualNames}
                                disabled={!isEditing}
                                onChange={(e) => handleFieldChange("childBirthYear", child.childId, e.target.value)}
                            />
                        </div>
                    </div>
                    <label htmlFor={`school_${child.childId}`}>School</label>
                    <input
                        id={`school_${child.childId}`}
                        type="text"
                        value={child?.childSchool || ""}
                        disabled={!isEditing}
                        onChange={(e) => handleFieldChange("childSchool", child.childId, e.target.value)} />
                    <hr></hr>
                </div>
            ))}
            <div className={style.editChildren}>
                <div onClick={addChild}>
                    <label htmlFor="name">Add Child</label>
                    <Image src={plus} alt="plus" />
                </div>
                <div onClick={() => removeChild(childrenData.length - 1)}>
                    <label htmlFor="name">Remove Child</label>
                    <Image src={minus} alt="minus" />
                </div>
            </div>
        </div>
    );
};

export default ChildForm;
