"use client";

import React, { useState, useEffect } from "react";
import styles from "./ProductTable.module.css";
import Image from "next/image";
import { deleteCombo } from "@/libs/Action/action";
import PageLoader from "@/components/PageLoader/PageLoader";

async function fetchProducts() {
  const res = await fetch("http://localhost:3000/api/combo", {
    cache: "no-store", // Ensure fresh data every time
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

async function updateProduct(id, updatedData) {
  const res = await fetch(`http://localhost:3000/api/combo/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    throw new Error("Failed to update product");
  }
  return res.json();
}

export default function ComboTable() {
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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

    getProducts(); // Fetch data on component mount
  }, []); // Empty dependency array ensures this runs only once

  const handleEditClick = (id, product) => {
    setEditingId(id);
    setEditData(product);
  };

  const handleInputChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedProduct = await updateProduct(editingId, editData);
      setProductList((prevList) =>
        prevList.map((product) =>
          product._id === editingId ? updatedProduct : product
        )
      );
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  if (productList.length === 0) {
    return (<PageLoader/>) // Show loading message while data is fetched
  }

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className="text-3xl text-center font-extrabold underline mb-4">Combos</h1>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
              <th>Image</th>
              <th>Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Min Quantity</th>
              <th>Max Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {productList.map((product) => (
              <tr key={product._id} className={styles.tr}>
                <td className={styles.td}>
                  <Image
                    src={product.img || "/placeholder.png"}
                    width={50}
                    height={50}
                    objectFit="cover"
                    alt="Product Image"
                  />
                </td>
                <td className={styles.td}>{product._id.slice(0, 4)}...</td>
                <td className={styles.td}>
                  {editingId === product._id ? (
                    <input
                      type="text"
                      value={editData.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                  ) : (
                    product.title
                  )}
                </td>
                <td className={styles.td}>
                  {editingId === product._id ? (
                    <textarea
                      value={editData.desc || ""}
                      onChange={(e) =>
                        handleInputChange("desc", e.target.value)
                      }
                    />
                  ) : (
                    product.desc
                  )}
                </td>
                <td className={styles.td}>
                  {editingId === product._id ? (
                    <input
                      type="number"
                      value={editData.prices?.[0]?.pricePerUnit || ""}
                      onChange={(e) =>
                        handleInputChange("prices", [
                          {
                            ...editData.prices?.[0],
                            pricePerUnit: e.target.value,
                          },
                        ])
                      }
                    />
                  ) : (
                    product.prices?.[0]?.pricePerUnit || "N/A"
                  )}
                </td>
                <td className={styles.td}>
                  {editingId === product._id ? (
                    <input
                      type="number"
                      value={editData.prices?.[0]?.minQuantity || ""}
                      onChange={(e) =>
                        handleInputChange("prices", [
                          {
                            ...editData.prices?.[0],
                            minQuantity: e.target.value,
                          },
                        ])
                      }
                    />
                  ) : (
                    product.prices?.[0]?.minQuantity || "N/A"
                  )}
                </td>

                <td className={styles.td}>
                  {editingId === product._id ? (
                    <input
                      type="number"
                      value={editData.maxQuantity || ""}
                      onChange={(e) =>
                        handleInputChange("maxQuantity", e.target.value)
                      }
                    />
                  ) : (
                    product.maxQuantity
                  )}
                </td>
                <td className={styles.td}>
                  {editingId === product._id ? (
                    <div className={styles.options}>
                      <button className={styles.button} onClick={handleSave}>
                        Save
                      </button>
                      <button className={styles.bbutton} onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className={styles.options}>
                      <button
                        className={styles.button}
                        onClick={() => handleEditClick(product._id, product)}
                      >
                        Edit
                      </button>
                      <form action={deleteCombo}>
                        <input type="hidden" name="id" value={product._id} />
                        <button className={styles.bbutton}>Delete</button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
