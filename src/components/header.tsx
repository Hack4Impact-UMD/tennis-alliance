import Image from "next/image";
import Logo from "../assets/logo.png";
import classes from "@/styles/header.module.css";

const Header = () => {
    return (
        <div className={classes.header}>
            <Image src={Logo} className={classes.logo} alt="Logo" />
        </div>
    );
};

export default Header;
