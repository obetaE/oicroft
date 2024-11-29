import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import EmailForm from "@/components/EmailForm/EmailForm";
import styles from "../admin.module.css";

const emailMessage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.adminbg}>
        <div className={styles.usersection}>
          <Navbar />
          <h1 className={styles.userTitle}>Email Management</h1>
          <EmailForm />
        </div>
      </div>
    </div>
  );
};

export default emailMessage;
