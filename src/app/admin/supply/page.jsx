import React from "react"
import styles from "./orders.module.css";
import Navbar from "@/components/Navbar/Navbar";
import ProductTracking from "@/components/ProductTracking/ProductTracking";

export default function OrderList() {
  return (
    <div className={styles.container}>
      <div className={styles.adminbg}>
        <Navbar/>
        <div className={styles.section}>
         <ProductTracking/>
        </div>
      </div>
    </div>
  );
}
