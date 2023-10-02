'use client'
import Image from 'next/image'
import styles from './page.module.css'
import React, {useState, useEffect} from 'react';



export default function Home() {
 

    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [tags, setTag] = useState([]);
  
    useEffect(() => {
      fetch("http://api.quotable.io/random")
        .then(res => res.json())
        .then(
          (quote) => {
            setQuote(quote.content);  
            setAuthor(quote.author);
            setTag(quote.tags);
          }
        )
    },[]);
  
    let fetchNewQuote = () => {
      fetch("http://api.quotable.io/random")
        .then(res => res.json())
        .then(
          (quote) => {
            setQuote(quote.content);  
            setAuthor(quote.author);
            setTag(quote.tags)
          }
        )
    }
  
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
      {/*Actual Quote*/}
      <div>
        <h2>
          The type of Quote is: 
        </h2>
        <h2>
            <ul>
              {tags.map((tag, index) => (
              <li key={index}>{tag}</li>
              ))}
           </ul>
        </h2>
        <p>{quote}</p>
        <p>- {author}</p>
        <button onClick={fetchNewQuote}>Fetch New Quote</button>
      </div>
    </main>
  )
}
