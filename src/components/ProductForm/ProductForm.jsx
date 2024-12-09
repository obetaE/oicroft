"use client";
import React, { useState } from "react";
import styles from "./ProductForm.module.css";
import axios from "axios";

const ProductForm = () => {
  const [prices, setPrices] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [regularDiscount, setRegularDiscount] = useState(0);
  const [promoCodes, setPromoCodes] = useState([]);

  const addPromoCode = () => {
    setPromoCodes([...promoCodes, { code: "", discountValue: "" }]);
  };

  const removePromoCode = (index) => {
    const updatedPromoCodes = promoCodes.filter((_, idx) => idx !== index);
    setPromoCodes(updatedPromoCodes);
  };

  const handlePromoCodeChange = (index, field, value) => {
    const updatedPromoCodes = [...promoCodes];
    updatedPromoCodes[index][field] = value;
    setPromoCodes(updatedPromoCodes);
  };

  const addPriceEntry = () => {
    setPrices([
      ...prices,
      {
        type: "unit",
        unit: "",
        price: "",
        stock: "",
        minQuantity: "",
        pricePerUnit: "",
      },
    ]);
  };

  const removePriceEntry = (index) => {
    const updatedPrices = prices.filter((_, idx) => idx !== index);
    setPrices(updatedPrices);
  };

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...prices];
    updatedPrices[index][field] = value;
    setPrices(updatedPrices);
  };

  const handleTypeToggle = (index) => {
    const updatedPrices = [...prices];
    updatedPrices[index].type =
      updatedPrices[index].type === "unit" ? "counter" : "unit";
    updatedPrices[index].unit = "";
    updatedPrices[index].price = "";
    updatedPrices[index].minQuantity = "";
    updatedPrices[index].pricePerUnit = "";
    setPrices(updatedPrices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "uploads");

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dudlxsoui/image/upload",
        formData
      );
      const { url } = uploadRes.data;

      const secureUrl = url.replace("http://", "https://");

      // Prepare prices array without the `type` field
      const formattedPrices = prices.map((price) => {
        const { type, ...rest } = price; // Remove `type`
        return rest;
      });

      const productData = {
        title,
        desc,
        img: secureUrl,
        prices: formattedPrices.filter(
          (p) => (p.unit && p.price) || (p.minQuantity && p.pricePerUnit) // Keep only valid entries
        ),
        discounts: {
          regularDiscount: parseFloat(regularDiscount),
          promoCodes: promoCodes.map((code) => ({
            code: code.code,
            discountValue: parseFloat(code.discountValue),
          })),
        },
      };

      await axios.post("/api/order", productData);

      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Add a New Product</h1>

        {/* File upload */}
        <div className={styles.item}>
          <label className={styles.label}>Choose an Image</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        {/* Title input */}
        <div className={styles.item}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description input */}
        <div className={styles.item}>
          <label className={styles.label}>Description</label>
          <textarea
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {/* Pricing options */}
        <div className={styles.item}>
          <label className={styles.label}>Pricing Options</label>
          {prices.map((price, index) => (
            <div key={index} className={styles.priceEntry}>
              <select
                value={price.type}
                onChange={() => handleTypeToggle(index)}
              >
                <option value="unit">Unit-Based</option>
                <option value="counter">Counter-Based</option>
              </select>

              {/* Conditional rendering based on price type */}
              {price.type === "unit" ? (
                <>
                  <input
                    type="text"
                    placeholder="Unit (e.g., kg, tuber)"
                    value={price.unit}
                    onChange={(e) =>
                      handlePriceChange(index, "unit", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={price.price}
                    onChange={(e) =>
                      handlePriceChange(index, "price", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Min Quantity"
                    value={price.minQuantity} // Added for unit-based products
                    onChange={(e) =>
                      handlePriceChange(index, "minQuantity", e.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  <input
                    type="number"
                    placeholder="Min Quantity"
                    value={price.minQuantity}
                    onChange={(e) =>
                      handlePriceChange(index, "minQuantity", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price per Unit"
                    value={price.pricePerUnit}
                    onChange={(e) =>
                      handlePriceChange(index, "pricePerUnit", e.target.value)
                    }
                  />
                </>
              )}
              <input
                type="number"
                placeholder="Stock"
                value={price.stock}
                onChange={(e) =>
                  handlePriceChange(index, "stock", e.target.value)
                }
              />
              <button type="button" onClick={() => removePriceEntry(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addPriceEntry}>
            Add Price Entry
          </button>
        </div>

        {/* Regular discount */}
        <div className={styles.item}>
          <label className={styles.label}>Regular Discount (%)</label>
          <input
            type="number"
            value={regularDiscount}
            onChange={(e) => setRegularDiscount(e.target.value)}
            placeholder="Enter discount (e.g., 10 for 10%)"
          />
        </div>

        {/* Promo codes */}
        <div className={styles.item}>
          <label className={styles.label}>Promo Codes</label>
          {promoCodes.map((code, index) => (
            <div key={index} className={styles.promoEntry}>
              <input
                type="text"
                placeholder="Promo Code"
                value={code.code}
                onChange={(e) =>
                  handlePromoCodeChange(index, "code", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Discount Value (%)"
                value={code.discountValue}
                onChange={(e) =>
                  handlePromoCodeChange(index, "discountValue", e.target.value)
                }
              />
              <button type="button" onClick={() => removePromoCode(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addPromoCode}>
            Add Promo Code
          </button>
        </div>

        {/* Submit button */}
        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
