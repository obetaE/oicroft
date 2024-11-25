import React from "react";
import Secondnav from "@/components/secondnav/Secondnav";
import styles from "./cart.module.css";
import CartContent from "@/components/CartContent/CartContent";


const cart = () => {
  return (
    <div className={styles.container}>
      <Secondnav />
      <CartContent/>
          </div>
  );
};

export default cart;
