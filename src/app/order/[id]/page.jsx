import React from "react";
import styles from "@/app/order/product.module.css";
import Secondnav from "@/components/secondnav/Secondnav";
import ProductInfo from "@/components/ProductInfo/ProductInfo";

const product = () => {
  return (
    <div className={styles.container}>
      <Secondnav />
      <ProductInfo />
    </div>
  );
};

export default product;
