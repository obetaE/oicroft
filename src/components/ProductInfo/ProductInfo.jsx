"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductInfo.module.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addProductToCart } from "@/redux/cartSlice";

const ProductInfo = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const order = () => {
    router.push("/order");
  };

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(product.prices[0]?.minQuantity || 1);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [promoDiscountValue, setPromoDiscountValue] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // e.g., 'success' or 'error'

  const isUnitBased = product.prices.some((price) => price.unit);
  const selectedPrice = isUnitBased
    ? product.prices[selectedSizeIndex]?.price || 0
    : product.prices[0]?.pricePerUnit || 0;

  const selectedStock = isUnitBased
    ? product.prices[selectedSizeIndex]?.stock || 0
    : product.prices[0]?.stock || 0;

  const minQuantity = isUnitBased
    ? product.prices[selectedSizeIndex]?.minQuantity || 1
    : product.prices[0]?.minQuantity || 1;

  const totalStock = useMemo(() => {
    const stock = product.prices.reduce(
      (sum, price) => sum + (price.stock || 0),
      0
    );
    return stock;
  }, [product.prices]);

  const totalPrice = useMemo(() => {
    let price = quantity * selectedPrice;

    if (product.discounts?.regularDiscount) {
      price -= price * (product.discounts.regularDiscount / 100);
    }

    if (promoDiscountValue > 0) {
      price -= price * (promoDiscountValue / 100);
    }

    return price;
  }, [quantity, selectedPrice, product.discounts, promoDiscountValue]);

  const applyPromoCode = () => {
    if (isPromoApplied) {
      setPromoError("Promo code already used!");
      return;
    }

    const promo = product.discounts?.promoCodes?.find(
      (promo) => promo.code === promoCode.trim()
    );

    if (promo) {
      setPromoError("");
      setPromoSuccess(true);
      setIsPromoApplied(true);
      setPromoDiscountValue(promo.discountValue);
    } else {
      setPromoError("Invalid promo code!");
      setPromoSuccess(false);
      setPromoDiscountValue(0);
    }
  };

const handleClick = () => {
  if (quantity > selectedStock) {
    setAlertMessage("Selected quantity exceeds available stock!");
    setAlertType("error");
    setTimeout(() => setAlertMessage(""), 5000); // Clears the alert after 5 seconds
    return;
  }

  const cartData = {
    id: product._id || product.id,
    title: product.title,
    img: product.img,
    price: totalPrice,
    quantity,
    unit: isUnitBased ? product.prices[selectedSizeIndex]?.unit : null,
  };

  dispatch(addProductToCart(cartData));
   setAlertMessage("Product has been Added!");
   setAlertType("success");
    setTimeout(() => setAlertMessage(""), 3000);
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
          <div className={styles.productInfo}>
            <div className={styles.left}>
              <div className={styles.imgContainer}>
                <Image
                  src={product.img}
                  alt={product.title}
                  fill
                  className={styles.img}
                />
              </div>
            </div>
            <div className={styles.right}>
              <h1 className={styles.title}>{product.title}</h1>
              <span className={styles.price}>₦{totalPrice.toFixed(2)}</span>
              <p className={styles.desc}>{product.desc}</p>

              <p className={styles.stock}>
                Stock Available:{" "}
                {isUnitBased
                  ? selectedStock > 0
                    ? `${selectedStock}`
                    : "Out of Stock"
                  : totalStock}
              </p>

              {product.discounts?.regularDiscount > 0 && (
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
                  <button
                    onClick={applyPromoCode}
                    className={styles.promoButton}
                  >
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
                          if (option.stock > 0) {
                            setSelectedSizeIndex(index);
                            setQuantity(option.minQuantity || 1);
                          }
                        }}
                      >
                        <span className={styles.number}>
                          {option.stock > 0 ? option.unit : "Out of Stock"}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <h2 className={styles.choose}>
                  Minimum Quantity: {minQuantity}
                </h2>
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
                {alertMessage && (
                  <div
                    className={`${styles.alert} ${
                      alertType === "success"
                        ? styles.successAlert
                        : styles.errorAlert
                    }`}
                  >
                    {alertMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
