"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/adminDash.module.css"
import {Checkbox} from "@nextui-org/react";






const participants = [
    { first_name: "John", last_name: "Doe",  email: "johndoe@gmail.com", type: "Volunteer", age: "10", town:"Jersey City"}, 
    { first_name: "Jane", last_name: "Dame",  email: "janedoe@gmail.com", type: "Participant", age: "11", town:"Jersey City"}, 
    { first_name: "Jason", last_name: "Doe", email: "jasondoe@gmail.com", type: "Participant", age: "15", town:"Jersey City"}]; 



const Searchbar = () => {

    const [showFilterBar, setShowFilterBar] = useState(false); 

    const [activeSearch, setActiveSearch] = useState<{ first_name: string; last_name: string; email: string; type: string; age: string; town: string}[]>([]);
    const [lastNameFilter, setLastNameFilter] = useState('');
    const [townFilter, setTownFilter] = useState('');
    const [ageFilter, setAgeFilter] = useState('');
    const [participantFilter, setParticipantFilter] = useState(true);
    const [volunteerFilter, setVolunteerFilter] = useState(true);

    useEffect(() => {
        // Set activeSearch to the full list of participants initially
        setActiveSearch(participants);
    }, []);

    const handleFilterButtonClick = () => {
        setShowFilterBar(!showFilterBar); // Toggle the visibility of the filter bar
    }

    const handleSearch = (e:any) => {
        const searchTerm = e.target.value;

        if (searchTerm == '') {
            setActiveSearch(participants);
        } else {
            // Filter participants and extract names
            const filteredParticipants = participants.filter((participant) =>
                (participant.first_name.concat(" ").concat(participant.last_name)).toLowerCase().includes(searchTerm.toLowerCase())
            );

            setActiveSearch(filteredParticipants);
        }
    }

    const applyFilters = (participantsToFilter: { first_name: string; last_name: string;email: string; type: string; age: string; town: string }[]) => {
        // Apply filters
        const filteredParticipants = participantsToFilter.filter(
            (participant) =>
                participant.last_name.toLowerCase().includes(lastNameFilter.toLowerCase()) &&
                participant.town.toLowerCase().includes(townFilter.toLowerCase()) && 
                participant.age.toLowerCase().includes(ageFilter.toLowerCase()) && 
                ((participantFilter && participant.type === 'Participant') || (volunteerFilter && participant.type === 'Volunteer') || (participantFilter && volunteerFilter))
        );
    
        setActiveSearch(filteredParticipants);
    }


    return (
        <div>
            <span className={styles.label}>All Participants</span>
            <div >
                <input className={styles.search} type="search" placeholder='Search' onChange ={(e) => handleSearch(e)}>
                </input>
                <button onClick={handleFilterButtonClick} className = {styles.filter}> Filter </button>
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
                        <span className={styles.name}>{participant.first_name}{" "}{participant.last_name} </span>
                        <span className={styles.email}>{participant.email} </span>
                        <span className={styles.type}>{participant.type}   </span>
                    </div>
                         ))}
                </div>
                )
            }
            {
                (
                    showFilterBar && 
                    <div className={styles.filterbar}>
                        <div className={styles.parent}>
                            <input className ={styles.filterbar_search} type="search" placeholder='Last Name' value={lastNameFilter} onChange={(e) => setLastNameFilter(e.target.value)}>
                            </input>
                            <input className ={styles.filterbar_search} type="search" placeholder='Town/City' value={townFilter} onChange={(e) => setTownFilter(e.target.value)}>
                            </input>
                            <input className ={styles.filterbar_search} type="search" placeholder='Age' value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                            </input>
                            
                        </div>
                        <div className={styles.parent_bottom}>
                            <input className={styles.box} type="checkbox" checked={participantFilter} onChange={() => setParticipantFilter(!participantFilter)}></input> <p className={styles.checkbox}>Participants</p>
                            <input className={styles.box} type="checkbox" checked={volunteerFilter} onChange={() => setVolunteerFilter(!volunteerFilter)}></input> <p className={styles.checkbox}>Volunteer</p>
                            <div className={styles.button}>
                                <button className={styles.apply} onClick={() => applyFilters(participants)}>APPLY</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
       
    )
}


export default Searchbar; 

