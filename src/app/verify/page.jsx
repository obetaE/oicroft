"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (token) {
      fetch(`/api/verify?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setStatus(data.error);
          } else {
            setStatus("Email successfully verified!");
            setTimeout(() => {
              router.push("/login");
            }, 3000);
          }
        })
        .catch(() => setStatus("Failed to verify email"));
    }
  }, [token, router]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{status || "Verifying your email..."}</p>
    </div>
  );
}
