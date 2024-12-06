"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./resendotp.module.css"
import Link from "next/link";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setMessage(data.error || data.message);
    } catch {
      setMessage("Failed to resend verification link. Please try again.");
    }
  };

  return (
    <div className={styles.loadingcontainer}>
      <div className={styles.loadimgcontainer}>
        <Image
          src="/Website page.png"
          alt="loading image"
          width={200}
          height={200}
        />
        <form onSubmit={handleResend} className={styles.status}>
          <h1 className={styles.header}>Resend Verification Link</h1>
          <input
          className={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className={styles.button} type="submit">Resend Link</button>
          <button className={styles.button}><Link href="/" >Back to Homepage</Link></button>
          {message && <p className={styles.para}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
