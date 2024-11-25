import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import SupportForm from "@/components/SupportForm/SupportForm";
import AdminSupport from "@/components/AdminSupport/AdminSupport";
import styles from "../admin.module.css";

const supportPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.adminbg}>
        <div className={styles.section}>
          <Navbar />
          <h1 className={styles.userTitle} >Support Management</h1>
          <div className={styles.row}>
            <div className={styles.col}>
              <AdminSupport />
            </div>
            <div className={styles.col}>
              <SupportForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default supportPage;
