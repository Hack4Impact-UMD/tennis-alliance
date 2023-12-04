import Image from "next/image";
import classes from "@/styles/tennisBackground.module.css";
import Background from "@/assets/tennis-background.png";

interface TennisBackgroundProps {
    title: string;
    subtitle: string;
}

const TennisBackground = ({ title, subtitle }: TennisBackgroundProps) => {
    return (
        <div className={classes.background}>
            <Image
                src={Background}
                className={classes.background}
                alt="Tennis Background"
            />
            <span>
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
            </span>
        </div>
    );
};

export default TennisBackground;
