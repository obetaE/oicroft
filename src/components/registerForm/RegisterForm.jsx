"use client";
import React from "react";
import styles from "./RegisterForm.module.css";
import { register } from "@/libs/Action/action";
import { useActionState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter} from "next/navigation";

export default function RegisterForm() {
  const [state, formAction] = useActionState(register, undefined);
  const router = useRouter();
  useEffect(() => {
    state?.success && router.push("/login");
  }, [state?.success, router]);

  return (
    <div className={styles.container}>
      <form action={formAction} className={styles.registerform}>
        <h2>Create Your Account</h2>
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
        <div className={styles.formgroup}>
          <div className={styles.button}>
            {state?.error}
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
