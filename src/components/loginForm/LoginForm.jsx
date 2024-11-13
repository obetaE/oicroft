"use client";
import React from "react";
import styles from "./LoginForm.module.css";
import { login } from "@/libs/Action/action";
import { useActionState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { googleLogin } from "@/libs/Action/action";
import Image from "next/image";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, undefined);
  const router = useRouter();
//   useEffect(() => {
//     state?.success && router.push("/login");
//   }, [state?.success, router]);

  return (
    <div className={styles.container}>
      <div className={styles.loginbox}>
        <form action={formAction}>
          <h2>Sign In to Your Account</h2>
          <div className={styles.usersection}>
            <label className={styles.label} htmlFor="username">
              UserName :
            </label>

            <input
              type="text"
              placeholder="Username"
              name="username"
              id="username"
              className={styles.username}
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
          <Link href="/forgotpassword">Forgot password?</Link>
          <span>|</span>
          <Link href="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
