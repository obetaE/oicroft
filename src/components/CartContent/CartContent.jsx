// CartContent.jsx
"use client";

import React, { useMemo, useEffect, useState } from "react";
import styles from "./CartContent.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/redux/cartSlice";
import axios from "axios";
import DeliveryChoiceForm from "@/components/DeliveryChoiceForm/DeliveryChoiceForm"; // Assume this component exists

const createOrder = async (orderData, dispatch) => {
  try {
    console.log("Creating order with data:", orderData);
    const response = await fetch("/api/trackorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error("Failed to create order");

    const data = await response.json();
    console.log("Order created successfully:", data);

    // Reset cart after successful order creation
    dispatch(reset());
    return data; // Return order data for further processing if needed
  } catch (err) {
    console.error("Order creation error:", err.message);
    throw err; // Re-throw error for upstream handling
  }
};

const handlePaystackCheckout = async (orderData, dispatch, user) => {
  if (!user || !user.email || !user.id) {
    alert("User details are missing. Please log in.");
    console.error("Checkout halted: Missing user details.");
    return;
  }

  try {
    console.log("Initializing Paystack checkout with:", orderData);
    const response = await axios.post("/api/paystack/initialize", {
      amount: orderData.total * 100,
      email: user.email,
      metadata: {
        userId: user.id,
        custom_fields: orderData.products.map((product) => ({
          display_name: product.title,
          quantity: product.quantity || product.minQuantity,
          price: product.pricePerUnit || product.price,
          id: product._id || product.id,
        })),
      },
    });

    if (
      !response.data ||
      !response.data.authorization_url ||
      !response.data.reference
    ) {
      console.error("Failed to initialize Paystack payment:", response.data);
      alert("Failed to initialize payment. Please try again.");
      return;
    }

    const { authorization_url, reference } = response.data;
    console.log("Paystack initialized. Redirecting to:", authorization_url);

    await createOrder({ ...orderData, reference, userId: user.id }, dispatch);
    window.location.href = authorization_url; // Redirect to Paystack checkout
  } catch (err) {
    console.error("Paystack checkout error:", err.message);
    alert(`Payment failed: ${err.message}`);
  }
};

const CartContent = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [user, setUser] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPickupChoice, setShowPickupChoice] = useState(false);
  const [isCheckoutActive, setIsCheckoutActive] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user session...");
        const response = await fetch("/api/session");
        if (!response.ok) throw new Error("Session fetch failed");

        const data = await response.json();
        console.log("Session fetched successfully:", data);
        setUser(data.user || null);
      } catch (err) {
        console.error("Session fetch error:", err.message);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const aggregatedProducts = useMemo(() => {
    const productMap = cart.products.reduce((acc, product) => {
      const key = `${product.title}-${product.unit || "counter"}`;
      if (acc[key]) acc[key].quantity += product.quantity;
      else acc[key] = { ...product };
      return acc;
    }, {});
    return Object.values(productMap);
  }, [cart.products]);

  return (
    <div>
      <div className={styles.cartbg}>
        <div className={styles.section}>
          <div className={styles.left}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tr}>
                  <td>Name</td>
                  <td>Image</td>
                  <td>Quantity</td>
                  <td>Unit</td>
                  <td>Price</td>
                  <td>Total</td>
                </tr>
              </thead>
              <tbody>
                {aggregatedProducts.map((product, index) => (
                  <tr className={styles.td} key={product._id || index}>
                    <td>{product.title}</td>
                    <td>
                      <Image
                        src={product.img}
                        alt="Product"
                        height={30}
                        width={30}
                      />
                    </td>
                    <td>{product.quantity}</td>
                    <td>{product.unit || product.minQuantity}</td>
                    <td>₦{product.price}</td>
                    <td>₦{product.price * product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.right}>
            <div className={styles.wrapper}>
              <h2 className={styles.title}>CART TOTAL</h2>
              <div className={styles.totalText}>
                <b>₦{cart.total}</b>
              </div>

              {!showCheckout && (
                <button onClick={() => setShowCheckout(true)}>PROCEED</button>
              )}

              {showCheckout && !showPickupChoice && (
                <button onClick={() => setShowPickupChoice(true)}>
                  PICKUP CHOICE
                </button>
              )}

              {showPickupChoice && (
                <DeliveryChoiceForm
                  orderId={user?.currentOrderId || "mockOrderId"} // Pass the orderId
                  userId={user?.id || ""}
                  onChoiceSubmit={async (choice) => {
                    try {
                      const payload = {
                        orderId: user.currentOrderId,
                        userId: user.id,
                        choice,
                      };
                      const response = await axios.post(
                        "/api/delivery-choice",
                        payload
                      );

                      if (response.data.success) {
                        alert(response.data.message);
                        setIsCheckoutActive(true);
                      } else {
                        alert("Failed to save delivery choice.");
                      }
                    } catch (err) {
                      console.error(
                        "Error submitting delivery choice:",
                        err.message
                      );
                      alert("An error occurred. Please try again.");
                    }
                  }}
                />
              )}

              {showCheckout && (
                <button
                  disabled={!isCheckoutActive}
                  onClick={() => {
                    if (!cart.total || !aggregatedProducts.length) {
                      alert("Cart is empty or invalid.");
                      console.error("Checkout prevented: Invalid cart.");
                      return;
                    }

                    const orderData = {
                      products: aggregatedProducts.map((product) => ({
                        productId: product._id || product.id,
                        title: product.title,
                        quantity: product.quantity,
                        unit: product.unit || product.minQuantity,
                        price: product.price || product.pricePerUnit,
                      })),
                      total: cart.total,
                    };

                    handlePaystackCheckout(orderData, dispatch, user);
                  }}
                >
                  CHECKOUT NOW
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
