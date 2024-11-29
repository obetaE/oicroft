"use client";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { login } from "@/libs/Action/action";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { googleLogin } from "@/libs/Action/action";
import Image from "next/image";
import ResendVerification from "../ResendVerification/ResendVerification";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, undefined);
  const router = useRouter();

  // State for forgot password
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/sendResetLink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setResetMessage("Password reset link sent! Check your email.");
      } else {
        setResetMessage(data.error || "Failed to send reset link.");
      }
    } catch (error) {
      console.error(error);
      setResetMessage("An error occurred while sending the reset link.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginbox}>
        <form action={formAction}>
          <h2>Sign In to Your Account</h2>
          <div className={styles.usersection}>
            <label className={styles.label} htmlFor="email">
              Email :
            </label>

            <input
              type="email"
              placeholder="Email"
              name="email"
              id="email"
              className={styles.username}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>

          <div className={styles.passwordsection}>
            <label className={styles.label} htmlFor="password">
              Password :
            </label>

            <input
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              className={styles.password}
            />
          </div>

          <button className={styles.login}>Login</button>
          {state?.error}
        </form>
        <form className={styles.googleform} action={googleLogin}>
          <button className={styles.googlelogin}>
            <div className={styles.imgContainer}>
              <Image
                src="/Google logo.png"
                alt="Google Logo"
                objectFit="contain"
                fill
              />
            </div>
            Sign In With Google
          </button>
        </form>

        <div className={styles.formfooter}>
          <button onClick={handleForgotPassword} className={styles.resetLink}>
            Forgot password?
          </button>
          <span>|</span>
          <Link href="/register">Create an account</Link>
        </div>
        <span>Havent gotten a Verfication Link? <ResendVerification/> </span>
      </div>
      {resetMessage && <p className={styles.resetMessage}>{resetMessage}</p>}
    </div>
  );
}
