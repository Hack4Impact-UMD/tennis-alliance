import { useAuth } from "@/auth/AuthProvider";
import { functions } from "@/config";
import styles from "@/styles/home.module.css";
import { type Event } from "@/types";
import { httpsCallable } from "firebase/functions";
import Head from "next/head";
import os from "os";
import { useEffect, useRef, useState } from "react";

const events2csv = (events: Event[]): string => {
  const fields = Object.keys(events[0]);
  const csv = events.map((event) => Object.values(event).join(","));
  csv.unshift(fields.join(","));
  return csv.join(os.EOL);
};

const Home = () => {
  const auth = useAuth();

  const [download, setDownload] = useState("");
  const downloadLink = useRef<HTMLAnchorElement>(null);

  const downloadMyCollection = async () => {
    // const { data: eventData } = await getEvents();
    // const events = eventData.map((event) => event.data);
    setDownload(events2csv([]));
  };

  useEffect(() => {
    if (download.length > 0) {
      downloadLink.current?.click();
      setDownload("");
    }
  }, [download]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <button
            style={{
              width: "160px",
              height: "40px",
              margin: "10px",
            }}
            onClick={() => {
              const func = httpsCallable(functions, "createAdminUser");
              console.log(auth.user);
              func()
                .then(() => {
                  console.log("done");
                })
                .catch((err) => console.log(err));
              // createEvent(event)
            }}
          >
            Create Test Event
          </button>
          <button
            style={{
              width: "160px",
              height: "40px",
              margin: "10px",
            }}
            className="downloadButton"
            onClick={downloadMyCollection}
          >
            Download Events
          </button>
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(download)}`}
            download="events.csv"
            hidden={true}
            ref={downloadLink}
          ></a>
        </div>
      </main>
    </>
  );
};

export default Home;
