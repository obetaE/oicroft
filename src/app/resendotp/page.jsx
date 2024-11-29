"use client";
import { useState } from "react";

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
    <form onSubmit={handleResend}>
      <h1>Resend Verification Link</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Resend Link</button>
      {message && <p>{message}</p>}
    </form>
  );
}
