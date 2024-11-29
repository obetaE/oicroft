"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./verify.module.css"

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
    <div>
      <h1>Email Verification</h1>
      <p>{status || "Verifying your email..."}</p>
    </div>
  );
}
