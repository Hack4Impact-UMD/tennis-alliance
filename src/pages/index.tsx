import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/home.module.css";
import Searchbar from "@/pages/admin_dash.tsx"
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        Searchbar ()
    );
}
