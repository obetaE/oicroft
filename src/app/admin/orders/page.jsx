import React from "react"
import styles from "./orders.module.css";
import Navbar from "@/components/Navbar/Navbar";
import OrderSection from "@/components/OrderSection/OrderSection";

export default function OrderList() {
  return (
    <div className={styles.container}>
      <div className={styles.adminbg}>
        <Navbar/>
        <div className={styles.section}>
         <OrderSection/>
        </div>
      </div>
    </div>
  );
}
