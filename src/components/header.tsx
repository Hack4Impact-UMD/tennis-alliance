import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import classes from "@/styles/header.module.css";
import Hamburger from "@/assets/hamburger.svg";
import Logo from "@/assets/logo.png";
import Profile from "@/assets/profile.png";
import XButton from "@/assets/x_white.svg";

const Header = () => {
    const [toggleNav, setToggleNav] = useState(false);
    const base = "https://tennisallianceaac.org";

    const toggleMenu = () => {
        setToggleNav(!toggleNav);
    };

    useEffect(() => {
        toggleNav
            ? (document.body.style.overflowY = "hidden")
            : (document.body.style.overflowY = "inherit");
    }, [toggleNav]);

    return (
        <nav className={classes.header}>
            <Image
                className={`${classes.hamburger} ${
                    toggleNav ? classes.active : ""
                }`}
                src={Hamburger}
                onClick={toggleMenu}
                alt="hamburger"
            />
            <Image className={classes.logo} src={Logo} alt="Logo" />

            <div
                className={`${classes.overlay} ${
                    toggleNav ? classes.active : ""
                }`}
            >
                <div
                    className={`${classes.menu} ${
                        toggleNav ? classes.active : ""
                    }`}
                >
                    <Image src={XButton} onClick={toggleMenu} alt="exit" />
                    <div className={classes.profile}>
                        <Image src={Profile} alt="profile" />
                        <p>First Last</p>
                        <p>email@test.com</p>
                    </div>

                    <p>Event Registration</p>
                    <Link href="/registration" onClick={toggleMenu}>
                        Registration
                    </Link>
                    <Link href="/events" onClick={toggleMenu}>
                        Events
                    </Link>
                    <Link href="/dashboard" onClick={toggleMenu}>
                        Dashboard
                    </Link>
                    <Link href="/settings" onClick={toggleMenu}>
                        Settings
                    </Link>
                    <Link href="/registration" onClick={toggleMenu}>
                        Sign Out
                    </Link>
                    <p>Information</p>
                    <Link href={base}>Home</Link>
                    <Link href={`${base}/about-us`}>About Us</Link>
                    <Link href={`${base}/tennis-center-updates`}>
                        Tennis Center
                    </Link>
                    <Link href={`${base}/programs`}>Programs and Events</Link>
                    <Link href={`${base}/outreach`}>Outreach</Link>
                    <Link href={`${base}/support`}>Support</Link>
                    <Link href={`${base}/contact-us`}>Contact Us</Link>
                </div>
                {toggleNav && (
                    <div className={classes.background} onClick={toggleMenu} />
                )}
            </div>
        </nav>
    );
};

export default Header;
