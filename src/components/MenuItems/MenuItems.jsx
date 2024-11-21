"use client"
import React, { useEffect, useState } from "react";
import styles from "./MenuItems.module.css";
import Image from "next/image";
import Link from "next/link";

async function fetchProducts() {
  const res = await fetch("http://localhost:3000/api/order", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export default function MenuItems() {
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchProducts();
        setProductList(data); // This is safe here
      } catch (err) {
        setError(err.message);
      }
    }

    getProducts(); // Fetch data only once during component mount
  }, []); // Ensure the dependency array is empty

  if (error) {
    return <p>Error: {error}</p>; // Show error message if fetching fails
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
    ); // Show loading state
  }

  return (
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
            <Link href={`/order/${item._id}`}>
              {" "}
              {/* Use the actual MongoDB `_id` */}
              <button>View Product</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
