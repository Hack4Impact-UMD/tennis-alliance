import Image from "next/image";
import Link from "next/link";
import TennisBackground from "@/components/tennisBackground";
import classes from "./registration.module.css";
import Tennis1 from "@/assets/tennis1.jpg";
import Tennis2 from "@/assets/tennis2.jpg";

const Registration = () => {
    return (
        <div className={classes.container}>
            <TennisBackground
                title="Welcome to Tennis Alliance of Anne Arundel County"
                subtitle="Please select a registration type"
            />
            <div className={classes.body}>
                <div>
                    <Image src={Tennis1} alt="Tennis 1" />
                    <Link href="/registration/family">
                        <button className="button">
                            Family Account Registration
                        </button>
                    </Link>
                </div>
                <div>
                    <Image src={Tennis2} alt="Tennis 2" />
                    <Link href="/registration/adult">
                        <button className="button">
                            Adult Account Registration
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Registration;
