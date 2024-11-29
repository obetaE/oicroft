"use client"
import styles from "./reset.module.css"
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetContent(){
     const searchParams = useSearchParams();
     const token = searchParams.get("token"); // Extract token from URL

     const [email, setEmail] = useState("");
     const [newPassword, setNewPassword] = useState("");
     const [message, setMessage] = useState("");

     const handleSubmit = async (e) => {
       e.preventDefault();

       try {
         const response = await fetch("/api/resetPassword", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ email, token, newPassword }), // Include token
         });

         const data = await response.json();

         if (response.ok) {
           setMessage("Password reset successfully!");
         } else {
           setMessage(data.error || "Something went wrong.");
         }
       } catch (error) {
         console.error("Failed to reset password:", error);
         setMessage("Failed to reset password.");
       }
     };

    return (
      <div className={styles.resetbox}>
        <form onSubmit={handleSubmit}>
          <h2>Reset Your Password</h2>
          <div className={styles.emailsection}>
            <label className={styles.label}>Email:</label>
            <input
              className={styles.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.passwordsection}>
            <label className={styles.label}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.password}
              required
            />
          </div>
          <button className={styles.reset} type="submit">
            Reset Password
          </button>
          {message && <p className={styles.message} >{message}</p>}
        </form>
      </div>
    );
}