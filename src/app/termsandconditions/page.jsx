import React from 'react'
import styles from './TOC.module.css'
import Navbar from "@/components/Navbar/Navbar"

const termsandconditions = () => {
  return (
    <>
      <div className={styles.container}>
        <Navbar />
        <div className={styles.top}>
          <div className={styles.topbg}>
            <h1>Terms of Use</h1>
          </div>
        </div>
        <div className={styles.bottom}></div>
      </div>
    </>
  );
}

export default termsandconditions
