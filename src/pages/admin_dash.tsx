'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/adminDash.module.css"
import {AiOutlineSearch} from 'react-icons/ai'



const participants = [
    { name: "John Doe", email: "johndoe@gmail.com", type: "Volunteer"}, 
    { name: "Jane Doe", email: "janedoe@gmail.com", type: "Participant"}, 
    { name: "Jason Doe", email: "jasondoe@gmail.com", type: "Participant"}]

const Searchbar = () => {
    const [activeSearch, setActiveSearch] = useState<{name: string,email: string, type:string }[]>([]);
    const handleSearch = (e:any) => {
        const searchTerm = e.target.value;

        if (searchTerm === '') {
            setActiveSearch([]);
        } else {
            // Filter participants and extract names
            const filteredParticipants = participants.filter((participant) =>
                participant.name.includes(searchTerm)
            );

            setActiveSearch(filteredParticipants);
        }
    }

    return (
        <form className="w-[500px] relative">
            <div className="relative">
                <input type="search" placeholder='Type here' className='w-full p-4 rounded-full bg-slate-800' onChange ={(e) => handleSearch(e)}>
                </input>
                <button className='absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-slate-900 rounded-full'>
                    <AiOutlineSearch />
                </button>
            </div>

            {
                (
                    activeSearch.length > 0 && 
                    <div className="absolute top-20 p-4 bg-slate-800 text-black w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
                        {activeSearch.map((participant, index) => (
                        <div key={index}>
                            <span>Name: {participant.name}</span>
                            <span>Email: {participant.email}</span>
                            <span>Type: {participant.type}</span>
                        </div>
                         ))}
                    </div>
                )
            }

        </form>
    )
}


export default Searchbar; 

