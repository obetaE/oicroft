import React from "react"
import PrivacyEditor from "@/components/PrivacyEditor/PrivacyEditor"
import styles from "../admin.module.css";
import Navbar from "@/components/Navbar/Navbar";

export default function privacypage(){
    return (
      <div className={styles.container}>
        <div className={styles.adminbg}>
          <div className={styles.section}>
            <Navbar />
            <h1 className={styles.adminTitle}>Privacy Policy Editor</h1>
            <PrivacyEditor />
          </div>
        </div>
      </div>
    );
}