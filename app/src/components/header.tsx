import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/auth/AuthProvider";
import { logOut } from "@/backend/AuthCalls";
import { getUserWithId } from "@/backend/FirestoreCalls";
import { User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import classes from "@/styles/header.module.css";
import Hamburger from "@/assets/hamburger.svg";
import Logo from "@/assets/logo.png";
import Profile from "@/assets/profile.png";
import XButton from "@/assets/x_white.svg";

const Header = () => {
    const [toggleNav, setToggleNav] = useState(false);
    const [user, setUser] = useState<User>();
    const router = useRouter();
    const base = "https://tennisallianceaac.org";
    const authContext = useAuth();

    const toggleMenu = () => {
        setToggleNav(!toggleNav);
    };

    const closeMenuAndNavigate = (path: string) => (event: React.MouseEvent) => {
        event.preventDefault();
        setToggleNav(false);
        router.push(path);
    };

    const handleSignOut = async () => {
        try {
            setUser(undefined);
            setRole("undefined");
            await logOut();
            setToggleNav(false);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    useEffect(() => {
        toggleNav
            ? (document.body.style.overflowY = "hidden")
            : (document.body.style.overflowY = "inherit");
    }, [toggleNav]);

    const [role, setRole] = useState<string>("");
    const currentUser = useAuth();
    const currentUserRole = currentUser?.token?.claims.role;

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const role = currentUserRole?.toString().toUpperCase();
                if (role) {
                    setRole(role);
                } else {
                    setRole("undefined");
                }
                // console.log("Role:", role);
            } catch (error) {
                console.error("Error fetching role:", error);
            }
        };

        fetchRole();
    }, [currentUserRole]);

    const navigateToDashboard = () => {
        router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!authContext.user) {
                setUser(undefined);
                return;
            }
            try {
                const user = await getUserWithId(authContext.user.uid);
                setUser(user);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, [authContext.user]);

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
                        <p>{user?.firstName} {user?.lastName}</p>
                        <p>{user?.email}</p>
                    </div>

                    <p className={classes.eventRegTitle}>Event Registration</p>
                    {role === "ADMIN" ? (
                        <Link href="/admin" onClick={closeMenuAndNavigate("/admin")}>
                            Admin Dashboard
                        </Link>
                    ) : (
                        <Link href="/dashboard" onClick={closeMenuAndNavigate("/dashboard")}>
                            Dashboard
                        </Link>
                    )}
                    <Link href="/settings" onClick={closeMenuAndNavigate("/settings")}>
                        Settings
                    </Link>
                    <Link href="/registration" onClick={closeMenuAndNavigate("/registration")}>
                        Account Registration
                    </Link>
                    {!authContext.user ? (
                        <Link href="/login" onClick={closeMenuAndNavigate("/login")}>
                            Sign In
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className={classes.menuButton}
                        >
                            Sign out
                        </button>
                    )}
                    <p className={classes.info}>Information</p>
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
