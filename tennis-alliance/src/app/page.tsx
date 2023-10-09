"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { useState } from 'react';

export default function Home() {
    const [quote, setQuote] = useState<any>(null);
    async function handleClick() {
        try {
            const response = await fetch('https://api.quotable.io/random');
            const json = await response.json();
            setQuote(json);
        } catch (error) {
            console.error(error);
            console.log("bruh quotable is down");
        }
    }
    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <div>
                    {quote && (
                        <div className={styles.description}>
                            <p>Quote: {quote['content']}</p>
                            <p>Author: {quote['author']}</p>
                            <p>Tags: {quote['tags'].join(', ')}</p>
                        </div>
                    )}
                    {!quote && <p>Click below for a quote!</p>}
                    <br />
                    <button className="button2" onClick={handleClick}>
                        Magical Quote Machine
                    </button>
                </div>
                <div>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        By{' '}
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            className={styles.vercelLogo}
                            width={100}
                            height={24}
                            priority
                        />
                    </a>
                </div>
            </div>
        </main>
    )
}
