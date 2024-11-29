import React from 'react'
import styles from "./login.module.css"
import LoginForm from '@/components/loginForm/LoginForm'
import Navbar from "@/components/Navbar/Navbar";

export default function loginPage(){

    return (
      <div className={styles.container}>
        <div className={styles.Loginbackground}>
          <Navbar />
          <LoginForm />
          
        </div>
      </div>
    );
}