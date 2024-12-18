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
          <Navbar />
        <div className={styles.section}>
          <h1 className={styles.adminTitle}>Admin Dashboard</h1>
          <div className={styles.links}>
            {session ? (
              session.user.isWorker && (
                <div className={styles.singleLink}>
                  <Link href="/admin/users">Manage Users</Link>
                </div>
              )
            ) : (
              <div className="hidden"></div>
            )}

            <div className={styles.singleLink}>
              <Link href="/admin/notifications">Manage Notifications</Link>
            </div>
            <div className={styles.singleLink}>
              <Link href="/admin/orders">Manage Orders</Link>
            </div>
            <div className={styles.singleLink}>
              <Link href="/admin/addProduct">Create Products</Link>
            </div>
            <div className={styles.singleLink}>
              <Link href="/admin/productpage">Manage Products</Link>
            </div>
            <div className={styles.singleLink}>
              <Link href="/admin/supply">Manage Supply</Link>
            </div>
            <div className={styles.singleLink}>
              <Link href="/admin/sliderpage">Manage Slider Images</Link>
            </div>
            <div className={styles.singleLink}>
              <Link href="/admin/supportpage">Manage Support</Link>
            </div>
            <div className={styles.singleLink}>
              <Link href="/admin/addlocation">Manage Locations</Link>
            </div>
            <div className={styles.singleLink}>
              <Link href="/admin/emailMessage">
                Send an Email to Your Users
              </Link>
            </div>
            {session ? (
              session.user.isWorker && (
                <div className={styles.singleLink}>
                  <Link href="/admin/termspage">
                    Edit the Terms and Conditions
                  </Link>
                </div>
              )
            ) : (
              <div className="hidden"></div>
            )}

            {session ? (
              session.user.isWorker && (
                <div className={styles.singleLink}>
                  <Link href="/admin/privacypage">Edit the Privacy Policy</Link>
                </div>
              )
            ) : (
              <div className="hidden"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
