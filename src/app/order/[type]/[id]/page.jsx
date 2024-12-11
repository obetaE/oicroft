import React from "react";
import styles from "@/app/order/product.module.css";
import ProductInfo from "@/components/ProductInfo/ProductInfo";
import ProductIdNav from "@/components/ProductIdNav/ProductIdNav";

async function fetchProduct(type, id) {
  const apiEndpoint = {
    order: `http://localhost:3000/api/order/${id}`,
    animal: `http://localhost:3000/api/animal/${id}`,
  };

  const res = await fetch(apiEndpoint[type], { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

const ProductPage = async ({ params }) => {
  const { type, id } = await params;
  const product = await fetchProduct(type, id);

  return (
    <div className={styles.container}>
      <ProductIdNav />
      <ProductInfo product={product} />
    </div>
  );
};

export default ProductPage;
