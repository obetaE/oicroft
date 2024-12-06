"use client";
import React, { useMemo } from "react";
import styles from "./CartContent.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/redux/cartSlice";
import axios from "axios";
import { useSession } from "next-auth/react"; // Import `useSession` from NextAuth

// Function to create an order in your backend
const createOrder = async (orderData, dispatch) => {
  try {
    const response = await fetch("/api/trackorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error("Failed to create order");

    const data = await response.json();
    dispatch(reset());
    console.log("Order created:", data);
  } catch (err) {
    console.error("Error creating order:", err.message);
  }
};

// Function to handle Paystack payment initialization
const handlePaystackCheckout = async (orderData, dispatch, user) => {
  if (!user || !user.email) {
    alert("User is not logged in or email is missing.");
    return;
  }

  try {
    const response = await axios.post(
      "/api/paystack/initialize",
      {
        amount: orderData.total * 100,
        metadata: {
          custom_fields: orderData.products.map((product) => ({
            display_name: product.title,
            quantity: product.quantity,
            unit: product.unit,
            price: product.price,
          })),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${user.id}`, // Pass the user ID
        },
      }
    );

    const { authorization_url, reference } = response.data;

    await createOrder({ ...orderData, reference }, dispatch);

    window.location.href = authorization_url; // Redirect to Paystack
  } catch (err) {
    console.error("Error initializing payment:", err.message);
    alert(`Payment failed: ${err.message}`);
  }
};

const CartContent = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { data: session } = useSession(); // Use NextAuth to retrieve session data
  const user = session?.user; // Access user information from session

  const aggregatedProducts = useMemo(() => {
    const productMap = cart.products.reduce((acc, product) => {
      const key = `${product.title}-${product.unit}`;
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
                  <tr className={styles.td} key={product.id || index}>
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
                    return;
                  }

                  const orderData = {
                    products: aggregatedProducts.map((product) => ({
                      productId: product._id,
                      title: product.title,
                      quantity: product.quantity,
                      unit: product.unit,
                      price: product.price,
                    })),
                    total: cart.total,
                  };

                  handlePaystackCheckout(orderData, dispatch, user); // Pass user from session here
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
