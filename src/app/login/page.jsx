import React from 'react'
import styles from "./login.module.css"
import LoginForm from '@/components/loginForm/LoginForm'
import Navbar from "@/components/Navbar/Navbar";

export default function loginPage(){

    // const session = await auth()
    // console.log(session)
    // const user = session?.user


    return (
      <div className={styles.container}>
        <div className={styles.Loginbackground}>
          <Navbar />
          <LoginForm />
        </div>
      </div>
    );
}