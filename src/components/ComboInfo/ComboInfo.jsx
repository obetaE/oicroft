"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductInfo.module.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addProductToCart } from "@/redux/cartSlice";

const ComboInfo = ({ combo }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const priceInfo = combo.prices[0] || {};

  const [quantity, setQuantity] = useState(priceInfo.minQuantity || 1);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [promoDiscountValue, setPromoDiscountValue] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(null);

  const orderCooldownMilliseconds = (combo.orderCooldown || 0) * 3600000;

  useEffect(() => {
    if (cooldownTime) {
      const timer = setInterval(() => {
        const remainingTime = cooldownTime - Date.now();
        if (remainingTime <= 0) {
          setCooldownTime(null);
          setIsButtonDisabled(false);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownTime]);

  const totalPrice = useMemo(() => {
    let price = quantity * (priceInfo.pricePerUnit || 0);

    if (combo.discounts?.regularDiscount > 0) {
      price -= price * (combo.discounts.regularDiscount / 100);
    }

    if (promoDiscountValue > 0) {
      price -= price * (promoDiscountValue / 100);
    }

    return price;
  }, [
    quantity,
    priceInfo.pricePerUnit,
    combo.discounts?.regularDiscount,
    promoDiscountValue,
  ]);

  const applyPromoCode = () => {
    if (isPromoApplied) {
      setPromoError("Promo code already used!");
      return;
    }

    const promo = combo.discounts?.promoCodes?.find(
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
    if (quantity > priceInfo.stock) {
      setAlertMessage("Selected quantity exceeds available stock!");
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 5000);
      return;
    }

    const cartData = {
      id: combo._id || combo.id,
      title: combo.title,
      img: combo.img,
      price: totalPrice,
      quantity,
    };

    dispatch(addProductToCart(cartData));
    setAlertMessage("Product has been added!");
    setAlertType("success");
    setTimeout(() => setAlertMessage(""), 3000);

    // Disable the button and start the cooldown
    setIsButtonDisabled(true);
    setCooldownTime(Date.now() + orderCooldownMilliseconds);
  };

  return (
    <div className={styles.container}>
      <div className={styles.productbg}>
        <div className={styles.backdrop}>
          <div
            onClick={() => router.push("/order")}
            className={styles.backbutton}
          >
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
                  src={combo.img}
                  alt={combo.title}
                  fill
                  className={styles.img}
                />
              </div>
            </div>
            <div className={styles.right}>
              <h1 className={styles.title}>{combo.title}</h1>
              <span className={styles.price}>₦{totalPrice.toFixed(2)}</span>
              <p className={styles.desc}>{combo.desc}</p>

              {/* <p className={styles.stock}>
                Stock Available:{" "}
                {priceInfo.stock > 0 ? priceInfo.stock : "Out of Stock"}
              </p> */}

              {combo.discounts?.regularDiscount > 0 && (
                <p className={styles.discount}>
                  {combo.discounts.regularDiscount}% OFF!!!
                </p>
              )}

              {combo.discounts?.promoCodes?.length > 0 && (
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

              {combo.maxQuantity === 1 ? (
                <button
                  onClick={handleClick}
                  className={styles.button}
                  disabled={isButtonDisabled || priceInfo.stock <= 0}
                >
                  Add to Cart
                </button>
              ) : (
                <div className={styles.add}>
                  <input
                    type="number"
                    min={priceInfo.minQuantity || 1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          priceInfo.minQuantity || 1,
                          parseInt(e.target.value) || 1
                        )
                      )
                    }
                    className={styles.quantity}
                  />
                  <button
                    onClick={handleClick}
                    className={styles.button}
                    disabled={isButtonDisabled || priceInfo.stock <= 0}
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              {cooldownTime && (
                <p className={styles.cooldown}>
                  Button will be active in{" "}
                  {Math.ceil((cooldownTime - Date.now()) / 1000)}s
                </p>
              )}

              {priceInfo.stock <= 0 && (
                <p className={styles.outOfStock}>Out of Stock</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboInfo;
