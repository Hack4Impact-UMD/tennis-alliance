import React from "react";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import EventForm from "@/components/EventForm";
import styles from "@/styles/events.module.css";
import logo from "@/assets/racket.png";
import leftChevron from "@/assets/left-chevron.png";
import xMark from "@/assets/x.png";

type EventType = {
    id: string;
    name: string;
    date: string;
    time: string;
    description: string;
    slotsOpen: number;
    totalSlots: number;
    type: string | string[];
};

type EventDisclosureProps = {
    event: EventType;
};

const EventDisclosure = (props: EventDisclosureProps) => {
    return (
        <Disclosure>
            {({open}) =>
                <>
                    <Image className={styles.racket} src={logo} alt="racket" />
                    <Disclosure.Button className={styles.disclosureToggle}>
                        {open ? (
                            <Image className={styles.x} src={xMark} alt="close" />
                        ) : (
                            <Image className={styles.arrowDown} src={leftChevron} alt="open" />
                        )}
                    </Disclosure.Button>
                                                            
                    <p className={styles.bigFont}>{props.event.name}</p>
                    <p className={styles.smallFont}>Time: {props.event.time}</p>
                    <p className={styles.smallFont}>Slots open: {props.event.slotsOpen} out of {props.event.totalSlots}</p>
                                                            
                    <Disclosure.Panel>
                        <p className={styles.smallFont}>{props.event.description}</p>
                        <EventForm
                            event={props.event}
                        />
                    </Disclosure.Panel>
                </>
            }
        </Disclosure>
    );
};

export default EventDisclosure;
