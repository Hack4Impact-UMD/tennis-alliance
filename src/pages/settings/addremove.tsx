"use client";
import React, { useState } from 'react';
import style from "../../styles/settings.module.css";
import Image from "next/image";
import plus from "../../assets/plus.png";

const ChildrenComponents = () => {
    const [sections, setSections] = useState([{ id: 1 }]);
  
    const addSection = () => {
      const newSections = [...sections, { id: sections.length + 1 }];
      setSections(newSections);
    };
    const removeSection = (idToRemove:number) => {
        if (sections.length > 1) {
            const updatedSections = sections.filter((section) => section.id !== idToRemove);
            const updatedIDs = updatedSections.map((section, index) =>({
                ...section,
                id: index + 1,
            }))
            setSections(updatedIDs);
        }
        
    };

    return (
      <div>
        {sections.map((section) => (
          <div key={section.id} className={style.personal}>
            <div className={style.textNames}>
              <div className={style.nameTitles}>
                <label htmlFor={`first_name_${section.id}`}>First Name</label>
                <input
                  type="text"
                  id={`first_name_${section.id}`}
                  placeholder=""
                  className={style.individualNames}
                />
              </div>
              <div className={style.nameTitles}>
                <label htmlFor={`last_name_${section.id}`} >Last Name</label>
                <input
                  type="text"
                  id={`last_name_${section.id}`}
                  placeholder=""
                  className={style.individualNames}
                />
              </div>
            </div>
            <label htmlFor={`email_${section.id}`}>Email</label>
            <input
              type="text"
              id={`email_${section.id}`}
              className={style.textbox}
            />
          </div>
          
        ))}
        <div className={style.textNames}>
            <div className={style.editChildren} onClick={addSection}>
                <label htmlFor='name' className={style.add}> ADD CHILD </label>
                <Image src={plus} alt="plus"/>
            </div>

            <div className={style.editChildren} onClick={() => removeSection(sections.length-1)}>
                <label htmlFor='name' className={style.add}> REMOVE CHILD </label>
                <Image src={plus} alt="plus"/>
            </div>

            
        </div>
      </div>
    );
  };
  
  export default ChildrenComponents;