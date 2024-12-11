"use client";
import React, { useState } from "react";
import styles from "./ProductForm.module.css";
import axios from "axios";

const ComboForm = () => {
  const [prices, setPrices] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [regularDiscount, setRegularDiscount] = useState(0);
  const [promoCodes, setPromoCodes] = useState([]);
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [orderCooldown, setOrderCooldown] = useState(null);

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
        pricingType: "counter",
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

      const productData = {
        title,
        desc,
        img: secureUrl,
        prices: prices.filter(
          (p) => (p.price && p.minQuantity) || (p.pricePerUnit && p.stock)
        ),
        discounts: {
          regularDiscount: parseFloat(regularDiscount),
          promoCodes: promoCodes.map((code) => ({
            code: code.code,
            discountValue: parseFloat(code.discountValue),
          })),
        },
        maxQuantity: maxQuantity ? parseInt(maxQuantity) : null,
        orderCooldown: orderCooldown ? parseInt(orderCooldown) : null,
      };

      await axios.post("/api/combo", productData);

      alert("Combo added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add Combo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Add a New Combo</h1>

        <div className={styles.item}>
          <label className={styles.label}>Choose an Image</label>
          <input className={styles.input} type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div className={styles.item}>
          <label className={styles.label}>Title</label>
          <input
          className={styles.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.item}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className={styles.item}>
          <label className={styles.label}>Pricing Options</label>
          {prices.map((price, index) => (
            <div key={index} className={styles.priceEntry}>
              <input
              className={styles.input}
                type="number"
                placeholder="Min Quantity"
                value={price.minQuantity}
                onChange={(e) =>
                  handlePriceChange(index, "minQuantity", e.target.value)
                }
              />
              <input
              className={styles.input}
                type="number"
                placeholder="Price per Unit"
                value={price.pricePerUnit}
                onChange={(e) =>
                  handlePriceChange(index, "pricePerUnit", e.target.value)
                }
              />
              <input
              className={styles.input}
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
          {prices.length === 0 && (
            <button type="button" onClick={addPriceEntry}>
              Add Price Entry
            </button>
          )}
        </div>

        <div className={styles.item}>
          <label className={styles.label}>Regular Discount (%)</label>
          <input
            className={styles.input}
            type="number"
            value={regularDiscount}
            onChange={(e) => setRegularDiscount(e.target.value)}
          />
        </div>

        <div className={styles.item}>
          <label className={styles.label}>Promo Codes</label>
          {promoCodes.map((code, index) => (
            <div key={index} className={styles.promoEntry}>
              <input
                className={styles.input}
                type="text"
                placeholder="Promo Code"
                value={code.code}
                onChange={(e) =>
                  handlePromoCodeChange(index, "code", e.target.value)
                }
              />
              <input
                className={styles.input}
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

        <div className={styles.item}>
          <label className={styles.label}>Max Quantity</label>
          <input
            className={styles.input}
            type="number"
            placeholder="Max Quantity"
            value={maxQuantity || ""}
            onChange={(e) => setMaxQuantity(e.target.value)}
          />
        </div>

        <div className={styles.item}>
          <label className={styles.label}>Order Cooldown (in hours)</label>
          <input
            className={styles.input}
            type="number"
            placeholder="Cooldown time"
            value={orderCooldown || ""}
            onChange={(e) => setOrderCooldown(e.target.value)}
          />
        </div>

        <div className={styles.buttoncontainer}>
          <button type="submit" className={styles.submit}>
            Add Combo
          </button>
        </div>
      </div>
    </form>
  );
};

export default ComboForm;
