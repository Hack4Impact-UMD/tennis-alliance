import Image from 'next/image'
import styles from './page.module.css'
import Link from "next/link"
export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Link href="/volunteer">Volunteer Form</Link>
    </div>
  )
}

