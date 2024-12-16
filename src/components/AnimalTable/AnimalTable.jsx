"use client";

import React, { useState, useEffect } from "react";
import styles from "./ProductTable.module.css";
import Image from "next/image";
import { deleteByProduct } from "@/libs/Action/action";
import PageLoader from "@/components/PageLoader/PageLoader";

async function fetchProducts() {
  const res = await fetch("http://localhost:3000/api/animal", {
    cache: "no-store", // Ensure fresh data every time
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

async function updateProduct(id, updatedData) {
  const res = await fetch(`http://localhost:3000/api/animal/${id}`, {
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

export default function ProductTable() {
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
        setError(err.message);const reloadCount = sessionStorage.getItem("reloadCount") || 0;
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

  const handleInputChange = (field, value, index = null) => {
    setEditData((prevData) => {
      if (index !== null) {
        const updatedPrices = [...prevData.prices];
        updatedPrices[index] = { ...updatedPrices[index], [field]: value };
        return { ...prevData, prices: updatedPrices };
      }
      return { ...prevData, [field]: value };
    });
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
    return <PageLoader/>; // Show loading message while data is fetched
  }

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className="text-3xl text-center font-extrabold underline mb-4">
          Animal By-Products
        </h1>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
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
          <tbody className={styles.tbody}>
            {productList.map((product) => (
              <React.Fragment key={product._id}>
                <tr className={styles.tr}>
                  <td
                    className={styles.td}
                    rowSpan={product.prices.length || 1}
                  >
                    <Image
                      src={product.img || "/placeholder.png"}
                      width={50}
                      height={50}
                      objectFit="cover"
                      alt="Product Image"
                    />
                  </td>
                  <td
                    className={styles.td}
                    rowSpan={product.prices.length || 1}
                  >
                    {product._id.slice(0, 4)}...
                  </td>
                  <td
                    className={styles.td}
                    rowSpan={product.prices.length || 1}
                  >
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
                  {product.prices && product.prices.length > 0 ? (
                    <>
                      {editingId === product._id ? (
                        <>
                          <td className={styles.td}>
                            <input
                              type="number"
                              value={editData.prices?.[0]?.price || ""}
                              onChange={(e) =>
                                handleInputChange("price", e.target.value, 0)
                              }
                            />
                          </td>
                          <td className={styles.td}>
                            <input
                              type="text"
                              value={editData.prices?.[0]?.unit || ""}
                              onChange={(e) =>
                                handleInputChange("unit", e.target.value, 0)
                              }
                            />
                          </td>
                          <td className={styles.td}>
                            <input
                              type="number"
                              value={editData.prices?.[0]?.stock || ""}
                              onChange={(e) =>
                                handleInputChange("stock", e.target.value, 0)
                              }
                            />
                          </td>
                          <td className={styles.td}>
                            <input
                              type="number"
                              value={editData.prices?.[0]?.minQuantity || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "minQuantity",
                                  e.target.value,
                                  0
                                )
                              }
                            />
                          </td>
                          <td className={styles.td}>
                            <input
                              type="number"
                              value={editData.prices?.[0]?.pricePerUnit || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "pricePerUnit",
                                  e.target.value,
                                  0
                                )
                              }
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className={styles.td}>
                            {product.prices[0].price || "N/A"}
                          </td>
                          <td className={styles.td}>
                            {product.prices[0].unit || "N/A"}
                          </td>
                          <td className={styles.td}>
                            {product.prices[0].stock || 0}
                          </td>
                          <td className={styles.td}>
                            {product.prices[0].minQuantity || "N/A"}
                          </td>
                          <td className={styles.td}>
                            {product.prices[0].pricePerUnit || "N/A"}
                          </td>
                        </>
                      )}
                      <td rowSpan={product.prices.length || 1}>
                        {editingId === product._id ? (
                          <div className={styles.options}>
                            <button
                              className={styles.button}
                              onClick={handleSave}
                            >
                              Save
                            </button>
                            <button
                              className={styles.bbutton}
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className={styles.options}>
                            <button
                              className={styles.button}
                              onClick={() =>
                                handleEditClick(product._id, product)
                              }
                            >
                              Edit
                            </button>
                            <form action={deleteByProduct}>
                              <input
                                type="hidden"
                                name="id"
                                value={product._id}
                              />
                              <button className={styles.bbutton}>Delete</button>
                            </form>
                          </div>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td colSpan={5}>No pricing available</td>
                      <td className={styles.td}>
                        <button className={styles.button}>Edit</button>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product._id} />
                          <button className={styles.button}>Delete</button>
                        </form>
                      </td>
                    </>
                  )}
                </tr>

                {product.prices?.slice(1).map((priceEntry, index) => (
                  <tr key={`${product._id}-price-${index}`}>
                    {editingId === product._id ? (
                      <>
                        <td className={styles.td}>
                          <input
                            type="number"
                            value={editData.prices?.[index + 1]?.price || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "price",
                                e.target.value,
                                index + 1
                              )
                            }
                          />
                        </td>
                        <td className={styles.td}>
                          <input
                            type="text"
                            value={editData.prices?.[index + 1]?.unit || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "unit",
                                e.target.value,
                                index + 1
                              )
                            }
                          />
                        </td>
                        <td className={styles.td}>
                          <input
                            type="number"
                            value={editData.prices?.[index + 1]?.stock || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "stock",
                                e.target.value,
                                index + 1
                              )
                            }
                          />
                        </td>
                        <td className={styles.td}>
                          <input
                            type="number"
                            value={
                              editData.prices?.[index + 1]?.minQuantity || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "minQuantity",
                                e.target.value,
                                index + 1
                              )
                            }
                          />
                        </td>
                        <td className={styles.td}>
                          <input
                            type="number"
                            value={
                              editData.prices?.[index + 1]?.pricePerUnit || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "pricePerUnit",
                                e.target.value,
                                index + 1
                              )
                            }
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className={styles.td}>
                          {priceEntry.price || "N/A"}
                        </td>
                        <td className={styles.td}>
                          {priceEntry.unit || "N/A"}
                        </td>
                        <td className={styles.td}>{priceEntry.stock || 0}</td>
                        <td className={styles.td}>
                          {priceEntry.minQuantity || "N/A"}
                        </td>
                        <td className={styles.td}>
                          {priceEntry.pricePerUnit || "N/A"}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


 