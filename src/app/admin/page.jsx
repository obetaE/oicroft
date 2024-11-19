import React from "react";
import styles from "./admin.module.css";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import {auth} from "@/auth";

const AdminPage = async () => {
  const session = await auth();
  const user = session?.user;
  const isWorker = user?.isWorker;
  return (
    <div className={styles.container}>
      <div className={styles.adminbg}>
        <div className={styles.section}>
          <Navbar />
          <h1 className={styles.adminTitle}>Admin Dashboard</h1>
          <div className={styles.links}>
            {!isWorker && (<div className={styles.singleLink}>
              <Link href="/admin/users">Manage Users</Link>
            </div>)}
            <div className={styles.singleLink}>
              <Link href="/admin/notifications">Manage Notifications</Link>
            </div>
            <div className={styles.singleLink}>
              <Link href="/admin/orders">Manage Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
