import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import AdminUserForm from "@/components/AdminUserForm/AdminUserForm";
import AdminUsers from "@/components/AdminUsers/AdminUsers";
import styles from "../admin.module.css";

const UsersPage = async () => {
  return (
    <div className={styles.Adminusercontainer}>
      <div className={styles.adminbg}>
          <Navbar />
        <div className={styles.usersection}>
          <h1 className={styles.userTitle} >User Management</h1>
          <div className={styles.row}>
            <div className={styles.col}>
              <AdminUsers />
            </div>
            <div className={styles.col}>
              <AdminUserForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
