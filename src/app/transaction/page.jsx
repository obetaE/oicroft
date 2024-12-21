import React from "react";
import styles from "./checkout.module.css";
import Image from "next/image";
import OrderHistory from "@/components/OrderHistory/OrderHistory";
import Secondnav from "@/components/secondnav/Secondnav";
const transaction = () => {
  return (
    <div className={styles.container}>
      <div className={styles.checkoutbg}>
        <Secondnav />
        <div className={styles.section}>
          <OrderHistory/>
        </div>
        <div className={styles.imgContainer}>
          <Image
            src="/Farm logo.png"
            alt="Farm Logo"
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default transaction;
