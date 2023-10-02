"use client"

import {useEffect, useState} from "react";

export default function Demo() {
    const [content, setQuote] = useState<string | null>(null)
    const [author, setAuthor] = useState<string | null>(null)
    const [heartbeat, setHeartbeat] = useState(0)

    useEffect(() => {
        fetch('https://api.quotable.io/random')
            .then(response => response.json())
            .then(data => {
              setQuote(data.content);
              setAuthor(data.author);
            } )
            
    }, [heartbeat])

    if (content) {
        return <div>
            <div>
              {content}
              <p>{author}</p>
            </div>
           
            <button onClick={() => setHeartbeat(h => h+1)}>New Quote Please!</button>
        </div>
    } else {
        return <div>Loading...</div>
    }
}

