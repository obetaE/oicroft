"use client";
import React, { useState, useEffect } from "react";
import PageLoader from "@/components/PageLoader/PageLoader";
import styles from "./ProductTracking.module.css";
import Image from "next/image"

export default function ProductTracking() {
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/productTracking");

        if (!response.ok) {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("API response is not an array:", data);
          setLoading(false);
          return;
        }

        setGroupedProducts(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      {loading ? (
        <PageLoader />
      ) : groupedProducts.length > 0 ? (
        groupedProducts.map(({ deliveryDate, products }, index) => (
          <div key={index} className={styles.productGroup}>
            <div className={styles.groupHeader}>
              <h2>Delivery Date: {deliveryDate}</h2>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <Image
                      width={70}
                      height={70}
                        src={product.img}
                        alt={product.name}
                        className={styles.productImage}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
}
