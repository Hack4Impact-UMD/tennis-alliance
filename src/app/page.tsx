import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

const Home = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Link href="/settings">Account Settings</Link>
        </div>
    );
};

export default Home;
