"use client";
import React, { useEffect, useState } from "react";
import styles from "./meals.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

async function fetchProducts() {
  const res = await fetch("http://localhost:3000/api/order", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

const Meals = () => {
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchProducts();
        setProductList(data);
      } catch (err) {
        setError(err.message);
      }
    }
    getProducts();
  }, []);

  const moveToOrderPage = () => {
    router.push("/order");
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (productList.length === 0) {
    return (
      <div className="load-btn-container">
        <div className="loading-button"></div>
        <div className="loading-button"></div>
        <div className="loading-button"></div>
        <div className="loading-button"></div>
        <div className="loading-button"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {productList.map((item) => (
          <div key={item._id} className={styles.item}>
            {item.img && (
              <div className={styles.imageContainer}>
                <Image
                  src={item.img}
                  alt="Image of our Product"
                  objectFit="contain"
                  fill
                />
              </div>
            )}
            <div className={styles.textContainer}>
              <h1>{item.title}</h1>
              <p>{item.desc}</p>
              <button onClick={moveToOrderPage}>See More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
