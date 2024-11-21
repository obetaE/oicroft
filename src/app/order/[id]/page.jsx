import React from "react";
import styles from "@/app/order/product.module.css";
import ProductInfo from "@/components/ProductInfo/ProductInfo";
import ProductIdNav from "@/components/ProductIdNav/ProductIdNav";

async function fetchProduct(id) {
  const res = await fetch(`http://localhost:3000/api/order/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}


const product = async ({params}) => {
  const {id} = await params;
  const product = await fetchProduct(id);
  return (
    <div className={styles.container}>
      <ProductIdNav />
      <ProductInfo product={product}  />
    </div>
  );
};

export default product;
