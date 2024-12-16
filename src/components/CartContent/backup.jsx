"use client";

import React, { useMemo, useEffect, useState } from "react";
import styles from "./CartContent.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/redux/cartSlice";
import axios from "axios";

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
    return data.order;
  } catch (err) {
    console.error("Order creation error:", err.message);
    throw err; // Rethrow to handle in the caller
  }
};

const deleteOrder = async (orderId) => {
  try {
    console.log(`Attempting to delete order with ID: ${orderId}`);
    const response = await fetch(`/api/trackorder/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete order");

    console.log("Order deleted successfully");
  } catch (err) {
    console.error("Order deletion error:", err.message);
  }
};

const handlePaystackCheckout = async (orderData, dispatch, user) => {
  if (!user || !user.email || !user.id) {
    alert("User details are missing. Please log in.");
    console.error("Checkout halted: Missing user details.");
    return;
  }

  try {
    console.log("Creating order before payment...");
    const createdOrder = await createOrder({ ...orderData, userId: user.id }, dispatch);

    console.log("Initializing Paystack checkout with:", createdOrder);
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

    if (!response.data || !response.data.authorization_url || !response.data.reference) {
      console.error("Failed to initialize Paystack payment:", response.data);
      alert("Failed to initialize payment. Please try again.");
      await deleteOrder(createdOrder._id); // Delete the order if payment initialization fails
      return;
    }

    console.log("Paystack initialized. Redirecting to:", response.data.authorization_url);
    window.location.href = response.data.authorization_url;
  } catch (err) {
    console.error("Paystack checkout error:", err.message);
    alert(`Payment failed: ${err.message}`);
  }
};

const CartContent = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [user, setUser] = useState(null);

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
              <button
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;

