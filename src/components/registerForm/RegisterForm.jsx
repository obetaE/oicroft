"use client";
import React, { useEffect, useState } from "react";
import styles from "./RegisterForm.module.css";
import { register } from "@/libs/Action/action";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [state, formAction] = useActionState(register, undefined);
  const [status, setStatus] = useState(""); // For status message
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setStatus(
        "Registration successful! Please check your email inbox or spam folder for a verification link to activate your account."
      );
      router.push("/verifyPage");
    }
  }, [state?.success, router]);

  return (
    <div className={styles.container}>
      <form action={formAction} className={styles.registerform}>
        <h2>Create Your Account</h2>
        {status && <p className={styles.statusMessage}>{status}</p>}{" "}
        {/* Show status here */}
        <div className={styles.formgroup}>
          <label htmlFor="name">UserName:</label>
          <input
            type="text"
            id="name"
            name="username"
            className={styles.name}
            required
            placeholder="Type your fullname"
          />
        </div>
        <div className={styles.formgroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Type Your Email"
            required
          />
        </div>
        <div className={styles.formgroup}>
          <label htmlFor="number">Phone Number:</label>
          <input
            type="text"
            id="number"
            name="number"
            placeholder="Start with your country code(i.e +234)"
            required
          />
        </div>
        <div className={styles.formgroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a new password"
            required
          />
        </div>
        <div className={styles.formgroup}>
          <label htmlFor="Confirmpassword">Confirm Password:</label>
          <input
            type="password"
            id="Confirmpassword"
            name="passwordRepeat"
            placeholder="Confirm Your Password"
            required
          />
        </div>
        <div className={styles.agree}>
          <input type="checkbox" id="agreement" required />
          <label htmlFor="agreement">
            Agree with our{" "}
            <Link className={styles.TOC} href="/termsandconditions">
              Terms and Conditions
            </Link>
          </label>
        </div>
        <div className={styles.formgroup}>
          <div className={styles.button}>
            {state?.error && (
              <p className={styles.errorMessage}>{state.error}</p>
            )}{" "}
            {/* Show error */}
            <button className={styles.signup}>Sign Up</button>
          </div>
        </div>
        <h5>
          Already have an account ? <Link href="/login">Sign In</Link>
        </h5>
      </form>
    </div>
  );
}
