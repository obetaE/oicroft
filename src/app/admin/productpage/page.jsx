"use client";

import React, { useState, useEffect } from "react";
import styles from "./product.module.css";
import Image from "next/image";
import { deleteProduct } from "@/libs/Action/action";

async function fetchProducts() {
  const res = await fetch("http://localhost:3000/api/order", {
    cache: "no-store", // Ensure fresh data every time
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export default function ProductPage() {
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchProducts();
        setProductList(data);
      } catch (err) {
        setError(err.message);
      }
    }

    getProducts(); // Fetch data on component mount
  }, []); // Empty dependency array ensures this runs only once

  if (error) {
    return <p>Error: {error}</p>; // Display error message if fetch fails
  }

  if (productList.length === 0) {
    return <p>Loading products...</p>; // Show loading message while data is fetched
  }

  return (
    <div className={styles.container}>
      <div className={styles.adminbg}>
        <div className={styles.section}>
          <div className={styles.item}>
            <h1>Products</h1>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Unit</th>
                  <th>Stock</th>
                  <th>Min Quantity</th>
                  <th>Price Per Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => (
                  <React.Fragment key={product._id}>
                    {/* Main Product Row */}
                    <tr>
                      <td rowSpan={product.prices.length || 1}>
                        <Image
                          src={product.img || "/placeholder.png"} // Provide a fallback image
                          width={50}
                          height={50}
                          objectFit="cover"
                          alt="Product Image"
                        />
                      </td>
                      <td rowSpan={product.prices.length || 1}>
                        {product._id}
                      </td>
                      <td rowSpan={product.prices.length || 1}>
                        {product.title}
                      </td>
                      {/* Display first price entry in this row */}
                      {product.prices && product.prices.length > 0 ? (
                        <>
                          <td>{product.prices[0].price || "N/A"}</td>
                          <td>{product.prices[0].unit || "N/A"}</td>
                          <td>{product.prices[0].stock || 0}</td>
                          <td>{product.prices[0].minQuantity || "N/A"}</td>
                          <td>{product.prices[0].pricePerUnit || "N/A"}</td>
                          <td rowSpan={product.prices.length || 1}>
                            <button className={styles.button}>Edit</button>
                            <form action={deleteProduct}>
                              <input
                                type="hidden"
                                name="id"
                                value={product._id}
                              />
                              <button className={styles.button}>Delete</button>
                            </form>
                          </td>
                        </>
                      ) : (
                        <>
                          <td colSpan={5}>No pricing available</td>
                          <td>
                            <button className={styles.button}>Edit</button>
                            <form action={deleteProduct}>
                              <input
                                type="hidden"
                                name="id"
                                value={product._id}
                              />
                              <button className={styles.button}>Delete</button>
                            </form>
                          </td>
                        </>
                      )}
                    </tr>

                    {/* Render additional rows for remaining prices */}
                    {product.prices?.slice(1).map((priceEntry, index) => (
                      <tr key={`${product._id}-price-${index}`}>
                        <td>{priceEntry.price || "N/A"}</td>
                        <td>{priceEntry.unit || "N/A"}</td>
                        <td>{priceEntry.stock || 0}</td>
                        <td>{priceEntry.minQuantity || "N/A"}</td>
                        <td>{priceEntry.pricePerUnit || "N/A"}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
