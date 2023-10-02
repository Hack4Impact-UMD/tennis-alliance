"use client"
import styles from './page.module.css'
import React,{useState} from 'react'; 

export default function Home() {
  const [quote, setQuote] = useState<any[]>([]);
  const [author, setAuthor] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  async function getQuote() {
    const response = await fetch('https://api.quotable.io/random')
    const quote = await response.json()
    console.log(quote.content)
    console.log(quote)
    return quote;
  }

  const handleClick = async () => {
    const quote = await getQuote();
    setQuote(quote.content);
    setAuthor(quote.author);
    setTags(quote.tags.toString());
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <p id="quote-body">{quote}</p>
        <p id="author">- {author}</p>
        <p id="tags">Tags: {tags}</p>
      <button
        id="generate-quote"
        onClick={handleClick}
      >Click to generate a quote!</button>
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
