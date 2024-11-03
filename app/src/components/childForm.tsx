import { useState } from "react";
import Image from "next/image";
import style from "@/styles/settings.module.css";
import plus from "@/assets/plus.png";
import minus from "@/assets/minus.png";

const ChildForm = () => {
    const [sections, setSections] = useState([{ id: 1 }]);

    const addSection = () => {
        const newSections = [...sections, { id: sections.length + 1 }];
        setSections(newSections);
    };
    const removeSection = (idToRemove: number) => {
        if (sections.length > 1) {
            const updatedSections = sections.filter(
                (section) => section.id !== idToRemove
            );
            const updatedIDs = updatedSections.map((section, index) => ({
                ...section,
                id: index + 1,
            }));
            setSections(updatedIDs);
        }
    };

    return (
        <div>
            {sections.map((section) => (
                <div key={section.id} className={style.child}>
                    <div className={style.fields}>
                        <div>
                            <label htmlFor={`first_name_${section.id}`}>
                                First Name
                            </label>
                            <input
                                id={`first_name_${section.id}`}
                                type="text"
                                placeholder=""
                                className={style.individualNames}
                            />
                        </div>
                        <div>
                            <label htmlFor={`last_name_${section.id}`}>
                                Last Name
                            </label>
                            <input
                                id={`last_name_${section.id}`}
                                type="text"
                                placeholder=""
                                className={style.individualNames}
                            />
                        </div>
                    </div>
                    <label htmlFor={`email_${section.id}`}>Email</label>
                    <input id={`email_${section.id}`} type="text" />
                </div>
            ))}
            <div className={style.editChildren}>
                <div onClick={addSection}>
                    <label htmlFor="name">Add Child</label>
                    <Image src={plus} alt="plus" />
                </div>
                <div onClick={() => removeSection(sections.length - 1)}>
                    <label htmlFor="name">Remove Child</label>
                    <Image src={minus} alt="minus" />
                </div>
            </div>
        </div>
    );
};

export default ChildForm;
