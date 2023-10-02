"use client"
import Image from 'next/image'
import styles from './page.module.css'
import { useState } from 'react';

const HomePage = () => {
  const [quoteData, setQuoteData] = useState(null);

  const handleClick = async () => {
      try {
          const response = await fetch('https://api.quotable.io/random');
          const data = await response.json();
          setQuoteData(data);
      } catch (error) {
          console.error("There was an error fetching the quote:", error);
      }
  };

  return (
    <div style={{ padding: '50px' }}>
        {quoteData ? (
            <div>
                <blockquote style={{ fontSize: '24px', marginBottom: '10px' }}>
                    {quoteData['content']}
                </blockquote>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>- {quoteData['author']}</p>
                <p style={{ fontSize: '16px', marginBottom: '30px' }}>
                    Tags: {quoteData['tags']}
                </p>
            </div>
        ) : (
            <p>Loading...</p>
        )}
        <button onClick={handleClick} style={{ fontSize: '18px' }}>New Quote</button>
    </div>
);
};



export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
        </p>
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

      <div>
      <HomePage/>
      </div>
      
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}
