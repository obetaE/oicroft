"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductInfo.module.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addProductToCart } from "@/redux/cartSlice";



const ProductInfo = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch(); // Calling the useDispatch redux hook

  const order = () => {
    router.push("/order");
  };

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0); // For unit-based products
  const [quantity, setQuantity] = useState(1); // Quantity for both pricing types
  const [promoCode, setPromoCode] = useState(""); // Promo code input
  const [promoError, setPromoError] = useState(""); // Error for invalid promo codes
  const [isPromoApplied, setIsPromoApplied] = useState(false); // Tracks if a promo code is already applied
  const [promoSuccess, setPromoSuccess] = useState(false); // Tracks successful promo code application

  // Determine if the product uses unit-based pricing or counter-based pricing
  const isUnitBased = product.prices.some((price) => price.unit);
  const selectedPrice = isUnitBased
    ? product.prices[selectedSizeIndex].price
    : product.prices[0].pricePerUnit;

  const minQuantity = isUnitBased ? 1 : product.prices[0].minQuantity || 1; // Default to 1 if no minQuantity is specified

  // Calculate the total price
  const totalPrice = useMemo(() => {
    let price = quantity * selectedPrice;

    // Apply regular discount
    if (product.discounts?.regularDiscount) {
      price -= price * (product.discounts.regularDiscount / 100);
    }

    return price;
  }, [quantity, selectedPrice, product.discounts]);

const applyPromoCode = () => {
  if (isPromoApplied) {
    setPromoError("Code Already Used!"); // Error if code is reused
    return;
  }

  const promo = product.discounts?.promoCodes?.find(
    (promo) => promo.code === promoCode.trim()
  );

  if (promo) {
    setPromoError(""); // Clear error
    setPromoSuccess(true); // Show success message
    setIsPromoApplied(true); // Mark promo code as applied
  } else {
    setPromoError("Invalid promo code!");
    setPromoSuccess(false); // Clear success message on invalid code
  }
};


  // Const to add items to cart
  const handleClick = () => {
    // Dispatch the action to add the product to the cart
    dispatch(
      addProductToCart({
        id: product.id, // Product ID
        title: product.title, // Product title
        img: product.img, // Product image
        price: totalPrice, // Total price based on quantity and selected size/unit
        quantity, // Quantity selected by the user
        unit: isUnitBased ? product.prices[selectedSizeIndex].unit : null, // Selected unit (only for unit-based products)
      })
    );
  };

  // If there's an unexpected "0", ensure it's tied to a meaningful variable
  const stockCount = product.stock || null; // Example stock count, if relevant

  return (
    <div className={styles.container}>
      <div className={styles.productbg}>
        <div className={styles.backdrop}>
          <div onClick={order} className={styles.backbutton}>
            <Image
              src="/Back Button.png"
              alt="Back button"
              width={50}
              height={50}
            />
            <button className={styles.orderpage}>Order Page</button>
          </div>
          <div className={styles.left}>
            <div className={styles.imgContainer}>
              <Image
                src={product.img}
                alt={product.title}
                fill
                className={styles.img}
                objectFit="contain"
              />
            </div>
          </div>
          <div className={styles.right}>
            <h1 className={styles.title}>{product.title}</h1>
            <span className={styles.price}>₦{totalPrice.toFixed(2)}</span>
            <p className={styles.desc}>{product.desc}</p>

            {/* Stock count (only if relevant) */}
            {product.stock !== undefined && (
              <p className={styles.stock}>
                {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
              </p>
            )}

            {/* Discounts */}
            {product.discounts?.regularDiscount && (
              <p className={styles.discount}>
                {product.discounts.regularDiscount}% OFF!!!
              </p>
            )}
            {product.discounts?.promoCodes?.length > 0 && (
              <div className={styles.promoCode}>
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className={styles.promoInput}
                />
                <button onClick={applyPromoCode} className={styles.promoButton}>
                  Apply
                </button>
                {promoError && <p className={styles.error}>{promoError}</p>}
                {promoSuccess && (
                  <p className={styles.success}>
                    Promo code applied successfully!
                  </p>
                )}
              </div>
            )}

            {/* Size or Minimum Quantity */}
            {isUnitBased ? (
              <>
                <h2 className={styles.choose}>Choose the size</h2>
                <div className={styles.sizes}>
                  {product.prices.map((option, index) => (
                    <div
                      key={index}
                      className={`${styles.size} ${
                        selectedSizeIndex === index ? styles.active : ""
                      }`}
                      onClick={() => {
                        setSelectedSizeIndex(index); // Update the selected size
                        setQuantity(1); // Reset quantity
                      }}
                    >
                      <span className={styles.number}>{option.unit}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <h2 className={styles.choose}>Minimum Quantity: {minQuantity}</h2>
            )}

            <div className={styles.add}>
              <input
                type="number"
                min={minQuantity}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(minQuantity, parseInt(e.target.value) || 1)
                  )
                }
                className={styles.quantity}
              />
              <button onClick={handleClick} className={styles.button}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
