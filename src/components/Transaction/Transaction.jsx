import React from "react";
import Link from "next/link"
import styles from "./transaction.module.css";

export default function Notification() {
  return (
    <button className={styles.links}>
      <Link href="/transaction">Transaction History</Link>
    </button>
  );
}
