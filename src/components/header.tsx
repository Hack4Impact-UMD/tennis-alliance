import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "@/styles/header.module.css";
// import about_icon from "../../assets/about_icon.svg";
import Hamburger from "@/assets/hamburger.svg";
import Logo from "@/assets/logo.png";
import Profile from "@/assets/profile.png";
import XButton from "@/assets/x_button.svg";
// import signout_icon from "../../assets/signout_icon.svg";

const Header = () => {
    const router = useRouter();
    const [toggleNav, setToggleNav] = useState(false);
    const base = "https://tennisallianceaac.org";

    const toggleMenu = () => {
        setToggleNav(!toggleNav);
    };

    const handleClick = (page: string) => {
        toggleMenu();
        router.push(page);
    };

    useEffect(() => {
        toggleNav
            ? (document.body.style.overflow = "hidden")
            : (document.body.style.overflow = "scroll");
    }, [toggleNav]);

    return (
        <nav className={classes.header}>
            <Image
                className={classes.hamburger}
                src={Hamburger}
                onClick={toggleMenu}
                alt="hamburger"
            />
            <Image className={classes.logo} src={Logo} alt="Logo" />

            {toggleNav && (
                <div className={classes.overlay}>
                    <div className={classes.menu}>
                        <Image src={XButton} onClick={toggleMenu} alt="exit" />
                        <div className={classes.profile}>
                            <Image src={Profile} alt="profile" />
                            <p className={classes.name}>First Last</p>
                            <p className={classes.email}>email@test.com</p>
                        </div>

                        <p>Event Registration</p>
                        <div onClick={() => handleClick("/registration")}>
                            Register
                        </div>
                        <div onClick={() => handleClick("/")}>Events</div>
                        <div onClick={() => handleClick("/settings")}>
                            Settings
                        </div>
                        <p>Information</p>
                        <div onClick={() => handleClick(base)}>Home</div>
                        <div onClick={() => handleClick(`${base}/about-us`)}>
                            About Us
                        </div>
                        <div
                            onClick={() =>
                                handleClick(`${base}/tennis-center-updates`)
                            }
                        >
                            Tennis Center
                        </div>
                        <div onClick={() => handleClick(`${base}/programs`)}>
                            Programs and Events
                        </div>
                        <div onClick={() => handleClick(`${base}/outreach`)}>
                            Outreach
                        </div>
                        <div onClick={() => handleClick(`${base}/support`)}>
                            Support
                        </div>
                        <div onClick={() => handleClick(`${base}/contact-us`)}>
                            Contact Us
                        </div>
                    </div>
                    <div className={classes.background} onClick={toggleMenu} />
                </div>
            )}
        </nav>
    );
};

export default Header;
