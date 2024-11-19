import React from "react";
import styles from "./admin.module.css";
import Navbar from "@/components/Navbar/Navbar";
import NotificationForm from "@/components/NotificationForm/NotificationForm";
import AdminUserForm from "@/components/AdminUserForm/AdminUserForm";
import AdminUsers from "@/components/AdminUsers/AdminUsers";
import { Suspense } from "react";
import AdminNotification from "@/components/AdminNotification/AdminNotification";
import {auth} from "@/auth";


const adminpage = async () => {

  const session = await auth();
  const user = session?.user;
  const isWorker = user?.isWorker;


  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.row}>
        <div className={styles.col}>
          <Suspense fallback={<div>Loading...</div>}>
            <AdminNotification />
          </Suspense>
        </div>
        <div className={styles.col}>
            <NotificationForm />
        </div>
      </div>

      {!isWorker && (<div className={styles.row}>
        <div className={styles.col}>
          <Suspense fallback={<div>Loading...</div>}>
            <AdminUsers />
          </Suspense>
        </div>
        <div className={styles.col}>
            <AdminUserForm />
        </div>
      </div>)}
    </div>
  );
};

export default adminpage;
