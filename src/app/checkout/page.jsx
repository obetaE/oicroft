import React from "react"
import styles from "./checkout.module.css";
import Image from "next/image";
import CheckoutContent from "@/components/CheckoutContent/CheckoutContent"
import Secondnav from "@/components/secondnav/Secondnav";
const Checkout = () => {
 

  return (
    <div className={styles.container}>
      <div className={styles.checkoutbg}>
        <Secondnav/>
        <div className={styles.section}>
          <CheckoutContent/>
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

export default Checkout;
