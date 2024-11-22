import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import os from "os";
//import { users } from "@/tests/mock";
import styles from "@/styles/admin.module.css";
import Email from "@/assets/email.png";
import Trash from "@/assets/trash.png";
import Popup from "./admin-event-create-popup";
import { adminGetEvents, adminGetUsers, getUserWithId } from "@/backend/FirestoreCalls";
import { User, CustomEvent } from "@/types";
import { set } from "date-fns";


const FILTERS = {
    "All Users": "all",
    Volunteer: "Volunteer",
    Participant: "Participant",
};

const AdminDashboard = () => {
    const [data, setData] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [download, setDownload] = useState("");
    const downloadLink = useRef<HTMLAnchorElement>(null);
    const [eventData, setEventData] = useState<CustomEvent[]>([]);
    const [userData, setUserData] = useState<User[]>([]);
    // const [selectedID, setSelectedID] = useState<string | null>(null);
    const [selectedEventTitle, setSelectedEventTitle] = useState("");
    const [allEmails, setAllEmails] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const events = await adminGetEvents();
                setEventData(events);
                console.log("Events:", events);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() =>  {
        const getUsers = async () => {
            try {
                const users = await adminGetUsers();
                setUserData(users);
                console.log("Users:", users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        getUsers();
    }, []);

    useEffect(() => {
        const filteredData = userData.filter(
            (row) =>
                (filter === "all" || row.type === filter) &&
                (search === "" ||
                    `${row.firstName} ${row.lastName}`
                        .toLowerCase()
                        .includes(search.toLowerCase()))
        );
        setData(filteredData);
        setAllEmails(filteredData.map((user) => user.email).join(","));
    }, [search, filter, userData]);

    useEffect(() => {
        if (download.length > 0) {
            downloadLink.current?.click();
            setDownload("");
        }
    }, [download]);

    const downloadUsers = async () => {
        const fields = Object.keys(userData);
        const csv = userData.map((user) => Object.values(user).join(","));
        csv.unshift(fields.join(","));
        setDownload(csv.join(os.EOL));
    };

    const getRowColor = (index: number): string => {
        return index % 2 == 0 ? "#E4F5E2" : "#FCF7CE";
    };

    const handleSelectEvent = async (event: CustomEvent) => {
        try {
            const participantsData = await Promise.all(
                event.participants.map(async (participantObj: any) => {
                    const participantId = String(participantObj.mainId);
                    try {
                        console.log(participantObj);
                        const user = await getUserWithId(participantId);
                        return user;
                    } catch (error) {
                        console.error(`Failed to fetch user with ID ${participantId}:`, error);
                        return null;
                    }
                })
            );
    
            setData(participantsData.filter(user => user !== null));
            setAllEmails(participantsData.filter(user => user !== null).map((user) => user.email).join(","));
            setSelectedEventTitle(event.title);
        } catch (error) {
            console.error("Error fetching participants data:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.table}>
                <div className={styles.createContainer}>
                    {<Popup/>}
                </div>
                {eventData && Object.keys(eventData).length > 0 && (
                    <div className={styles.events}>
                        <h3>Events</h3>
                        {eventData.map((event, index) => (
                            <div key={index} className={styles.eventRow} onClick={() => handleSelectEvent(event)}>
                                <div>{event.title}</div>
                                <div>{event.date}</div>
                            </div>
                        ))}
                    </div>
                )}
                {selectedEventTitle != "" ? <h3>You have selected {selectedEventTitle}.</h3> :
                    <h3>No event selected.</h3>
                }
                <p>All Users</p>
                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select onChange={(e) => setFilter(e.target.value)}>
                        {Object.entries(FILTERS).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={`${styles.row} ${styles.header}`}>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Type</span>
                    <div />
                    <div />
                </div>
                {data.map((row, i) => (
                    <div
                        key={i}
                        className={styles.row}
                        style={{ background: getRowColor(i) }}
                    >
                        <span>{row.firstName + " " + row.lastName}</span>
                        <span>{row.email}</span>
                        <span>{row.type}</span>
                        <button>
                            <a href={`mailto:${row.email}`} target="_blank" rel="noreferrer"><Image src={Email} alt="mail" /></a>
                        </button>
                        <button>
                            <Image src={Trash} alt="delete" />
                        </button>
                    </div>
                ))}
                <div className={styles.buttons}>
                    <button onClick={downloadUsers}>Export Users</button>

                    <button><a href={`mailto:tennisalliancemail@gmail.com?bcc=${allEmails}`} target="_blank" rel="noreferrer">Message All Participants</a></button>
                    <a
                        href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                            download
                        )}`}
                        download="users.csv"
                        hidden={true}
                        ref={downloadLink}
                    ></a>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
