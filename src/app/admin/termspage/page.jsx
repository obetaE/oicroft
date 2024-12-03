import React from "react"
import TermsEditor from "@/components/TermsEditor/TermsEditor"
import styles from "../admin.module.css";
import Navbar from "@/components/Navbar/Navbar";

export default function termspage(){
    return (
      <div className={styles.container}>
        <div className={styles.adminbg}>
          <div className={styles.section}>
            <Navbar />
            <h1 className={styles.adminTitle}>Terms and Conditions Editor</h1>
            <TermsEditor />
          </div>
        </div>
      </div>
    );
}