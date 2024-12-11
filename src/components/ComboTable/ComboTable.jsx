"use client";

import React, { useState, useEffect } from "react";
import styles from "./ComboTable.module.css";
import Image from "next/image";

async function fetchCombos() {
  const res = await fetch("http://localhost:3000/api/combo", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch combos");
  }
  return res.json();
}

async function updateCombo(id, updatedData) {
  const res = await fetch(`http://localhost:3000/api/combo/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    throw new Error("Failed to update combo");
  }
  return res.json();
}

async function deleteCombo(id) {
  const res = await fetch(`http://localhost:3000/api/combo/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete combo");
  }
  return res.json();
}

export default function ComboTable() {
  const [comboList, setComboList] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    async function getCombos() {
      try {
        const data = await fetchCombos();
        setComboList(data);
      } catch (err) {
        setError(err.message);
      }
    }

    getCombos();
  }, []);

  const handleEditClick = (id, combo) => {
    setEditingId(id);
    setEditData(combo);
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
      const updatedCombo = await updateCombo(editingId, editData);
      setComboList((prevList) =>
        prevList.map((combo) =>
          combo._id === editingId ? updatedCombo : combo
        )
      );
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCombo(id);
      setComboList((prevList) => prevList.filter((combo) => combo._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (comboList.length === 0) {
    return <p>Loading combos...</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Combos</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Prices</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comboList.map((combo) => (
            <React.Fragment key={combo._id}>
              <tr>
                <td rowSpan={combo.prices.length || 1}>
                  <Image
                    src={combo.img || "/placeholder.png"}
                    width={50}
                    height={50}
                    objectFit="cover"
                    alt="Combo Image"
                  />
                </td>
                <td rowSpan={combo.prices.length || 1}>{combo._id}</td>
                <td rowSpan={combo.prices.length || 1}>
                  {editingId === combo._id ? (
                    <input
                      type="text"
                      value={editData.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                  ) : (
                    combo.title
                  )}
                </td>
                <td rowSpan={combo.prices.length || 1}>
                  {editingId === combo._id ? (
                    <textarea
                      value={editData.desc || ""}
                      onChange={(e) =>
                        handleInputChange("desc", e.target.value)
                      }
                    />
                  ) : (
                    combo.desc
                  )}
                </td>
                {combo.prices && combo.prices.length > 0 ? (
                  <>
                    {editingId === combo._id ? (
                      <td>
                        {combo.prices.map((price, index) => (
                          <div key={index}>
                            <input
                              type="text"
                              placeholder="Pricing Type"
                              value={
                                editData.prices?.[index]?.pricingType || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "pricingType",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            <input
                              type="number"
                              placeholder="Stock"
                              value={editData.prices?.[index]?.stock || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  "stock",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            <input
                              type="number"
                              placeholder="Min Quantity"
                              value={editData.prices?.[index]?.minQuantity || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  "minQuantity",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            <input
                              type="number"
                              placeholder="Price Per Unit"
                              value={
                                editData.prices?.[index]?.pricePerUnit || 0
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "pricePerUnit",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                          </div>
                        ))}
                      </td>
                    ) : (
                      <td>
                        {combo.prices.map((price, index) => (
                          <div key={index}>
                            <p>Type: {price.pricingType}</p>
                            <p>Stock: {price.stock}</p>
                            <p>Min Qty: {price.minQuantity}</p>
                            <p>Price: {price.pricePerUnit}</p>
                          </div>
                        ))}
                      </td>
                    )}
                  </>
                ) : (
                  <td>No pricing available</td>
                )}
                <td rowSpan={combo.prices.length || 1}>
                  {editingId === combo._id ? (
                    <>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(combo._id, combo)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(combo._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
