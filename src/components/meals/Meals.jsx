"use client";
import React, { useEffect, useState } from "react";
import styles from "./meals.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/PageLoader/PageLoader";

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
        sessionStorage.removeItem("reloadCount"); // Clear reload count on success
      } catch (err) {
        const reloadCount = sessionStorage.getItem("reloadCount") || 0;
        if (reloadCount < 5) {
          sessionStorage.setItem("reloadCount", Number(reloadCount) + 1);
          window.location.reload();
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
    }
    getProducts();
  }, []);

  const moveToOrderPage = () => {
    router.push("/order");
  };

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  if (productList.length === 0) {
    return <PageLoader/>
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
