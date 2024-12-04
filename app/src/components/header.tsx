import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/auth/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import classes from "@/styles/header.module.css";
import Hamburger from "@/assets/hamburger.svg";
import Logo from "@/assets/logo.png";
import Profile from "@/assets/profile.png";
import XButton from "@/assets/x_white.svg";

const Header = () => {
    const [toggleNav, setToggleNav] = useState(false);
    const router = useRouter();
    const base = "https://tennisallianceaac.org";
    const authContext = useAuth();
    const user = authContext.user;

    const toggleMenu = () => {
        setToggleNav(!toggleNav);
    };

    useEffect(() => {
        toggleNav
            ? (document.body.style.overflowY = "hidden")
            : (document.body.style.overflowY = "inherit");
    }, [toggleNav]);

    const navigateToDashboard = () => {
        router.push("/dashboard");
    }

    return (
        <nav className={classes.header}>
            <Image
                className={`${classes.hamburger} ${toggleNav ? classes.active : ""
                    }`}
                src={Hamburger}
                onClick={toggleMenu}
                alt="hamburger"
            />
            <Image className={classes.logo} src={Logo} alt="Logo" onClick={navigateToDashboard} />

            <div
                className={`${classes.overlay} ${toggleNav ? classes.active : ""
                    }`}
            >
                <div
                    className={`${classes.menu} ${toggleNav ? classes.active : ""
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
                    <Link href="/dashboard" onClick={toggleMenu}>
                        Dashboard
                    </Link>
                    <Link href="/admin" onClick={toggleMenu}>
                        Admin Dashboard
                    </Link>
                    <Link href="/settings" onClick={toggleMenu}>
                        Settings
                    </Link>
                    <Link href="/login" onClick={toggleMenu}>
                        Sign In
                    </Link>
                    <p>Information</p>
                    <Link href={base}>Home</Link>
                    <Link href={`${base}/about-us`}>About Us</Link>
                    <Link href={`${base}/tennis-center-updates`}>
                        Tennis Center
                    </Link>
                    <Link href={`${base}/programs`}>Programs and Events</Link>
                </div>
                {toggleNav && (
                    <div className={classes.background} onClick={toggleMenu} />
                )}
            </div>
        </nav>
    );
};

export default Header;
