"use client";

import { useState } from "react";

export default function ResendVerification() {
  const [status, setStatus] = useState("");

  const handleResend = async () => {
    const email = prompt("Enter your email to resend the verification link:");

    if (!email) {
      setStatus("Email is required.");
      return;
    }

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(data.message);
      } else {
        setStatus(data.error || "Failed to resend verification link.");
      }
    } catch (err) {
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="text-[#666] underline">
      <button onClick={handleResend}>Resend Link</button>
      {status && <p>{status}</p>}
    </div>
  );
}
