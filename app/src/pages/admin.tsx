import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import os from "os";
import { users } from "@/tests/mock";
import styles from "@/styles/admin.module.css";
import Email from "@/assets/email.png";
import Trash from "@/assets/trash.png";
import Popup from "./admin-event-create-popup";

const FILTERS = {
    "All Users": "all",
    Volunteer: "Volunteer",
    Participant: "Participant",
};

const AdminDashboard = () => {
    const [data, setData] = useState(users);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [download, setDownload] = useState("");
    const downloadLink = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const filteredData = users.filter(
            (row) =>
                (filter === "all" || row.type === filter) &&
                (search === "" ||
                    `${row.first_name} ${row.last_name}`
                        .toLowerCase()
                        .includes(search.toLowerCase()))
        );
        setData(filteredData);
    }, [search, filter]);

    useEffect(() => {
        if (download.length > 0) {
            downloadLink.current?.click();
            setDownload("");
        }
    }, [download]);

    const downloadUsers = async () => {
        const fields = Object.keys(users[0]);
        const csv = users.map((user) => Object.values(user).join(","));
        csv.unshift(fields.join(","));
        setDownload(csv.join(os.EOL));
    };

    const getRowColor = (index: number): string => {
        return index % 2 == 0 ? "#E4F5E2" : "#FCF7CE";
    };

    return (
        <div className={styles.container}>
            <div className={styles.table}>
                <div className={styles.createContainer}>
                    {<Popup/>}
                </div>
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
                        <span>{row.first_name + " " + row.last_name}</span>
                        <span>{row.email}</span>
                        <span>{row.type}</span>
                        <button>
                            <Image src={Email} alt="mail" />
                        </button>
                        <button>
                            <Image src={Trash} alt="delete" />
                        </button>
                    </div>
                ))}
                <div className={styles.buttons}>
                    <button onClick={downloadUsers}>Export Users</button>

                    <button>Message All Participants</button>
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
