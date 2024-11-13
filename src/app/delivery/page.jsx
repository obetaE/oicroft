import React from "react"
import Secondnav from "@/components/secondnav/Secondnav";
import styles from "./delivery.module.css"
import Image from "next/image";

const delivery = () =>{
    return (
      <div className={styles.container}>
        <Secondnav />
        <div className={styles.cartbg}>
          <div className={styles.section}>
            <h1>How do you want to recieve your orders</h1>
            <button>Pickup</button>
            <button>Delivery</button>
          </div>
        </div>
        <div className={styles.imgContainer}>
          <Image
            src="/Farm logo.png"
            alt="Farm Icon"
            width={200}
            height={200}
          />
        </div>
      </div>
    );
}

export default delivery