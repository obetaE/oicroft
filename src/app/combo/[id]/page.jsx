import React from "react";
import styles from "@/app/combo/product.module.css";
import ComboInfo from "@/components/ComboInfo/ComboInfo";
import ProductIdNav from "@/components/ProductIdNav/ProductIdNav";

async function fetchProduct(id) {
  const res = await fetch(`http://localhost:3000/api/combo/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

const ComboProductPage = async ({ params }) => {
  const { id } = await params;
  const combo = await fetchProduct(id);

  return (
    <div className={styles.container}>
      <ProductIdNav />
      <ComboInfo combo={combo} />
    </div>
  );
};

export default ComboProductPage;
