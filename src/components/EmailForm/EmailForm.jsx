"use client";
import React, { useState } from "react";

export default function EmailForm() {
  const [emailContent, setEmailContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/sendEmails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent }),
      });

      if (response.ok) {
        alert("Emails sent successfully!");
        window.location.reload(); // Refresh the page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to send emails."}`);
      }
    } catch (error) {
      console.error("Failed to send emails:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <form className="styles.container" onSubmit={handleSubmit}>
      <textarea
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        placeholder="Type your message here"
        rows={30} // Fixed the typo from "row" to "rows"
      />
      <button type="submit">Send Email</button>
    </form>
  );
}
