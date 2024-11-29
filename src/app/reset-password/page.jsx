import React from "react"
import Navbar from "@/components/Navbar/Navbar";
import ResetContent from "@/components/ResetContent/ResetContent";
import styles from "./resetpassword.module.css"

export default function ResetPasswordPage() {
 
  return (
    <div className={styles.container}>
      <div className={styles.resetbackground}>
        <Navbar />
       <ResetContent/>
      </div>
    </div>
  );
}
