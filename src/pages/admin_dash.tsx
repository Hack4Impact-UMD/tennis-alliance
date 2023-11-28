'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/adminDash.module.css"






const participants = [
    { name: "John Doe", email: "johndoe@gmail.com", type: "Volunteer"}, 
    { name: "Jane Doe", email: "janedoe@gmail.com", type: "Participant"}, 
    { name: "Jason Doe", email: "jasondoe@gmail.com", type: "Participant"}]

const Searchbar = () => {
    const [activeSearch, setActiveSearch] = useState<{name: string,email: string, type:string }[]>([]);
    const handleSearch = (e:any) => {
        const searchTerm = e.target.value;

        if (searchTerm == '') {
            setActiveSearch(participants);
        } else {
            // Filter participants and extract names
            const filteredParticipants = participants.filter((participant) =>
                participant.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setActiveSearch(filteredParticipants);
        }
    }

    return (
        <form className={styles.form}>
            <span className={styles.label}>All Participants</span>
            <div className={styles.parent}>
                <input className={styles.search} type="search" placeholder='Search' onChange ={(e) => handleSearch(e)}>
                </input>
            </div>
            <div className={styles.participantcontainer}>
            <div className={styles.participantitem1}>
                <span className={styles.name}>Name </span>
                <span className={styles.email}>Email </span>
                <span className={styles.type1}>Participant or Volunteer </span>
            </div>
            </div>
            {
                
                (
                    activeSearch.length > 0 && 
                    <div className={styles.participantcontainer}>
                        {activeSearch.map((participant, index) => (
                        <div key={index} className={styles.participantitem}>
                            <span className={styles.name}>{participant.name} </span>
                            <span className={styles.email}>{participant.email} </span>
                            <span className={styles.type}>{participant.type}   </span>
                        </div>
                         ))}
                    </div>
                )
            }

        </form>
    )
}


export default Searchbar; 

