"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductInfo.module.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addProductToCart } from "@/redux/cartSlice";

const ProductInfo = ({ product }) => {
  console.log("Product data received:", product); // Debugging: Log incoming product data
  const router = useRouter();
  const dispatch = useDispatch();

  const order = () => {
    router.push("/order");
  };

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0); // For unit-based products
  const [quantity, setQuantity] = useState(1); // Quantity for both pricing types
  const [promoCode, setPromoCode] = useState(""); // Promo code input
  const [promoError, setPromoError] = useState(""); // Error for invalid promo codes
  const [isPromoApplied, setIsPromoApplied] = useState(false); // Tracks if a promo code is already applied
  const [promoSuccess, setPromoSuccess] = useState(false); // Tracks successful promo code application
  const [promoDiscountValue, setPromoDiscountValue] = useState(0); // Discount value of the applied promo code

  const isUnitBased = product.prices.some((price) => price.unit);
  const selectedPrice = isUnitBased
    ? product.prices[selectedSizeIndex].price
    : product.prices[0].pricePerUnit;

  const minQuantity = isUnitBased ? 1 : product.prices[0].minQuantity || 1;

  const totalPrice = useMemo(() => {
    let price = quantity * selectedPrice;

    if (product.discounts?.regularDiscount) {
      price -= price * (product.discounts.regularDiscount / 100);
    }

    if (promoDiscountValue > 0) {
      price -= price * (promoDiscountValue / 100);
    }

    console.log("Total Price Calculated:", price); // Debugging: Log calculated total price
    return price;
  }, [quantity, selectedPrice, product.discounts, promoDiscountValue]);

  const totalStock = useMemo(() => {
    const stock = product.prices.reduce(
      (sum, price) => sum + (price.stock || 0),
      0
    );
    console.log("Total Stock Calculated:", stock); // Debugging: Log calculated stock
    return stock;
  }, [product.prices]);

  const applyPromoCode = () => {
    if (isPromoApplied) {
      setPromoError("Promo code already used!");
      return;
    }

    const promo = product.discounts?.promoCodes?.find(
      (promo) => promo.code === promoCode.trim()
    );

    if (promo) {
      console.log("Promo Code Applied:", promo); // Debugging: Log applied promo code
      setPromoError("");
      setPromoSuccess(true);
      setIsPromoApplied(true);
      setPromoDiscountValue(promo.discountValue);
    } else {
      console.log("Invalid Promo Code Entered:", promoCode); // Debugging: Log invalid promo attempt
      setPromoError("Invalid promo code!");
      setPromoSuccess(false);
      setPromoDiscountValue(0);
    }
  };

  const handleClick = () => {
    const cartData = {
      id: product._id || product.id,
      title: product.title,
      img: product.img,
      price: totalPrice,
      quantity,
      unit: isUnitBased ? product.prices[selectedSizeIndex].unit : null,
    };
    console.log("Cart Data to Dispatch:", cartData); // Debugging: Log cart data before dispatch
    dispatch(addProductToCart(cartData));
  };

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

            {/* Stock Count */}
            <p className={styles.stock}>
              {totalStock > 0 ? `Stock: ${totalStock}` : "Out of Stock"}
            </p>

            {/* Regular Discount */}
            {product.discounts?.regularDiscount > 0 && (
              <p className={styles.discount}>
                {product.discounts.regularDiscount}% OFF!!!
              </p>
            )}

            {/* Promo Code Section */}
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
                        setSelectedSizeIndex(index);
                        setQuantity(1);
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
