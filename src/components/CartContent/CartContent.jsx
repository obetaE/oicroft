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
    console.log("Order creation successful. Response data:", data);
    dispatch(reset());
  } catch (err) {
    console.error("Error creating order:", err.message);
  }
};

const handlePaystackCheckout = async (orderData, dispatch, user) => {
  if (!user || !user.email || !user.id) {
    alert("User details are missing. Please log in.");
    console.log("Checkout halted: User details missing.");
    return;
  }

  console.log("Initializing Paystack checkout with orderData:", orderData);

  try {
    const response = await axios.post("/api/paystack/initialize", {
      amount: orderData.total * 100, // Convert to kobo
      email: user.email, // Pass user email
      metadata: {
        userId: user.id,
        custom_fields: orderData.products.map((product) => ({
          display_name: product.title,
          quantity: product.quantity,
          unit: product.unit,
          price: product.price,
          id: product._id || product.id,
        })),
      },
    });

    console.log("Paystack initialization response:", response.data);

    const { authorization_url, reference } = response.data;
    await createOrder({ ...orderData, reference, userId: user.id }, dispatch);

    window.location.href = authorization_url;
  } catch (err) {
    console.error("Error initializing payment:", err.message);
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
        if (!response.ok) throw new Error("Failed to fetch session data");

        const data = await response.json();
        console.log("User session fetched successfully:", data);
        setUser(data.user || null);
      } catch (err) {
        console.error("Error fetching session:", err.message);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const aggregatedProducts = useMemo(() => {
    console.log("Aggregating products in the cart...");
    const productMap = cart.products.reduce((acc, product) => {
      const key = `${product.title}-${product.unit}`;
      if (acc[key]) acc[key].quantity += product.quantity;
      else acc[key] = { ...product };
      return acc;
    }, {});
    return Object.values(productMap);
  }, [cart.products]);

  console.log("Cart content rendered. Current user:", user);
  console.log("Cart details:", cart);

  return (
    <div>
      <div className={styles.cartbg}>
        <div className={styles.section}>
          {/* Cart Table */}
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
                    <td>{product.unit}</td>
                    <td>₦{product.price}</td>
                    <td>₦{product.price * product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cart Total */}
          <div className={styles.right}>
            <div className={styles.wrapper}>
              <h2 className={styles.title}>CART TOTAL</h2>
              <div className={styles.totalText}>
                <b>₦{cart.total}</b>
              </div>
              <button
                onClick={() => {
                  if (!cart.total || !aggregatedProducts.length) {
                    alert("Cart is empty or total is invalid.");
                    console.log(
                      "Checkout prevented: Empty cart or invalid total."
                    );
                    return;
                  }

                  const orderData = {
                    products: aggregatedProducts.map((product) => ({
                      productId: product._id || product.id,
                      title: product.title,
                      quantity: product.quantity,
                      unit: product.unit,
                      price: product.price,
                    })),
                    total: cart.total,
                  };

                  console.log(
                    "Proceeding to checkout with orderData:",
                    orderData
                  );
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
