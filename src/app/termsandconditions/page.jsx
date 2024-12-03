import React from 'react'
import styles from './TOC.module.css'
import Navbar from "@/components/Navbar/Navbar"
import TermsDisplay from "@/components/TermsDisplay/TermsDisplay"
import PrivacyDisplay from "@/components/PrivacyDisplay/PrivacyDisplay"

const termsandconditions = () => {
  return (
    <>
      <div className={styles.container}>
        <Navbar />
        <div className={styles.top}>
          <div className={styles.topbg}>
            <h1>Terms of Use</h1>
            <h2>Terms and Conditions</h2>
            <h2>Privacy Policy</h2>
          </div>
        </div>
        <div className={styles.bottom}>
          <TermsDisplay/>
          <PrivacyDisplay/>
        </div>
      </div>
    </>
  );
}

export default termsandconditions
