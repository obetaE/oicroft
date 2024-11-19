"use client";

import React, { useState } from "react";
import styles from "./ProductInfo.module.css";
import Image from "next/image";
import { singleProduct } from "@/temp"; // Update the path accordingly

const ProductInfo = () => {
  // Initialize state for the selected size
  const [size, setSize] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.productbg}>
        <div className={styles.backdrop}>
          <div className={styles.left}>
            <div className={styles.imgContainer}>
              <Image
                src={singleProduct.img}
                alt={singleProduct.title}
                fill
                className={styles.img}
                objectFit="contain"
              />
            </div>
          </div>
          <div className={styles.right}>
            <h1 className={styles.title}>{singleProduct.title}</h1>
            <span className={styles.price}>
              $
              {singleProduct.price +
                singleProduct.options[size].additionalPrice}
            </span>
            <p className={styles.desc}>{singleProduct.desc}</p>
            <h2 className={styles.choose}>Choose the size</h2>
            <div className={styles.sizes}>
              {singleProduct.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.size} ${
                    size === index ? styles.active : ""
                  }`}
                  onClick={() => setSize(index)} // Update the state to the selected index
                >
                  <span className={styles.number}>{option.title}</span>
                </div>
              ))}
            </div>

            <h3 className={styles.choose}>Choose Additional Ingredients</h3>
            <div className={styles.ingredients}>
              <div className={styles.option}>
                <input
                  type="checkbox"
                  name="double"
                  id="double"
                  className={styles.checkbox}
                />
                <label htmlFor="double">Double Ingredients</label>
              </div>
              <div className={styles.option}>
                <input
                  type="checkbox"
                  name="cheese"
                  id="cheese"
                  className={styles.checkbox}
                />
                <label htmlFor="cheese">Extra Cheese</label>
              </div>
              <div className={styles.option}>
                <input
                  type="checkbox"
                  name="spicy"
                  id="spicy"
                  className={styles.checkbox}
                />
                <label htmlFor="spicy">Spicy Sauce</label>
              </div>
              <div className={styles.option}>
                <input
                  type="checkbox"
                  name="garlic"
                  id="garlic"
                  className={styles.checkbox}
                />
                <label htmlFor="garlic">Garlic Sauce</label>
              </div>
            </div>
            <div className={styles.add}>
              <input
                type="number"
                defaultValue={1}
                className={styles.quantity}
              />
              <button className={styles.button}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
