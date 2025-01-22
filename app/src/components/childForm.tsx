import { useEffect, useState } from "react";
import { Children } from "@/types";
import Image from "next/image";
import style from "@/styles/settings.module.css";
import plus from "@/assets/plus.png";
import minus from "@/assets/minus.png";
import { getChildren } from "@/backend/FirestoreCalls";

interface ChildFormProps {
    isEditing: boolean;
    userId: string;
    onChildrenChange: (children: Children[]) => void
}

const ChildForm = ({ isEditing, userId, onChildrenChange }: ChildFormProps) => {
    const [childrenData, setChildrenData] = useState<Children[]>([]);

    useEffect(() => {
        const fetchChildrenData = async () => {
            try {
                const children = await getChildren(userId);
                const updatedChildren = children.map((child, index) => ({
                    ...child,
                    childId: index, // Assign childId based on index
                }));
                setChildrenData(updatedChildren);
                onChildrenChange(updatedChildren);
            } catch (error) {
                console.log("Error fetching children's data:", error);
            }
        }
        fetchChildrenData();
    }, [userId])

    const addChild = () => {
        const newChild: Children = {
            childId: childrenData.length, // Assign the next available ID
            childFirstName: "",
            childLastName: "",
            childAge: 0,
            childBirthYear: 0,
            childSchool: "",
        };

        setChildrenData([...childrenData, newChild]); // Add new child and update the state
        onChildrenChange(childrenData); // Notify parent of the change
    };

    const removeChild = (idToRemove: number) => {
        if (childrenData.length > 1) {
            const updatedChildren = childrenData.filter(
                (child) => child.childId !== idToRemove
            );
            setChildrenData(updatedChildren);
            onChildrenChange(updatedChildren)
        }
    };

    const handleFieldChange = (
        field: keyof Children,
        childId: number,
        value: string
    ) => {
        setChildrenData((prev) => {
            const updated = prev.map((child) =>
                child.childId === childId
                    ? { ...child, [field]: value } // Update the specific field
                    : child
            );

            onChildrenChange(updated); // Notify parent of the change
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
                                onChange={(e) => handleFieldChange("childFirstName", child.childId || -1, e.target.value)}
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
                                onChange={(e) => handleFieldChange("childLastName", child.childId || -1, e.target.value)}
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
                                onChange={(e) => handleFieldChange("childAge", child.childId || -1, e.target.value)}
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
                                onChange={(e) => handleFieldChange("childBirthYear", child.childId || -1, e.target.value)}
                            />
                        </div>
                    </div>
                    <label htmlFor={`school_${child.childId}`}>School</label>
                    <input
                        id={`school_${child.childId}`}
                        type="text"
                        value={child?.childSchool || ""}
                        disabled={!isEditing}
                        onChange={(e) => handleFieldChange("childSchool", child.childId || -1, e.target.value)} />
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
