"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./verify.module.css"
import Image from "next/image"

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (token) {
      fetch(`/api/verify?token=${token}`)
        .then((res) => {
          if (!res.ok) throw new Error("Verification failed");
          return res.json();
        })
        .then((data) => {
          setStatus(data.message);
          setTimeout(() => router.push("/login"), 3000);
        })
        .catch(() => setStatus("Failed to verify email. Please try again."));
    }
  }, [token, router]);

  return (
    <div className={styles.loadingcontainer}>
      <div className={styles.loadimgcontainer}>
        <Image
          src="/Website page.png"
          alt="loading image"
          width={200}
          height={200}
        />
        <div className={styles.status}>
          <h1 className={styles.header}>Email Verification</h1>
          <div className={styles.loadbtncontainer}>
            <div className={styles.loadingbutton}></div>
            <div className={styles.loadingbutton}></div>
            <div className={styles.loadingbutton}></div>
            <div className={styles.loadingbutton}></div>
            <div className={styles.loadingbutton}></div>
          </div>
          <p className={styles.para}>{status || "Verifying your email..."}</p>
        </div>
      </div>
    </div>
  );
}
