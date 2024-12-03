"use client";
import React, { useMemo } from "react";
import styles from "./CartContent.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/redux/cartSlice"; // Assuming you have this action
import axios from "axios";

// Function to create an order in your backend
const createOrder = async (orderData, dispatch) => {
  try {
    const response = await fetch("/api/trackorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    const data = await response.json();
    console.log("Order created successfully:", data);

    // Dispatch reset cart action after order is created
    dispatch(reset());

    // Redirect to delivery page (or order confirmation page)
    window.location.href = "/delivery"; // Update this to match your delivery page route
  } catch (err) {
    console.error("Error creating order:", err.message);
    alert(`Error creating order: ${err.message}`);
  }
};

// Function to handle Paystack payment initialization
const handlePaystackCheckout = async (orderData, dispatch) => {
  try {
    // Call the Paystack API to initialize the transaction
    const response = await axios.post("/api/paystack/initialize", {
      email: "oicroftco@gmail.com", // Replace with the actual user's email
      amount: orderData.total * 100, // Paystack expects the amount in kobo (for NGN)
      metadata: {
        custom_fields: orderData.products.map((product) => ({
          display_name: product.title,
          quantity: product.quantity,
          unit: product.unit,
          price: product.price,
        })),
      },
    });

    // Extract the authorization URL and transaction reference from the response
    const { authorization_url, reference } = response.data;

    // Save the order in your database
    await createOrder({ ...orderData, reference }, dispatch);

    // Redirect the user to Paystack's payment page
    window.location.href = authorization_url;
  } catch (err) {
    console.error("Error initializing Paystack payment:", err.message);
    alert(`Payment failed: ${err.message}`);
  }
};

const CartContent = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // Use memoization to optimize performance when retrieving cart products
  const cartProducts = useMemo(() => cart.products, [cart.products]);

  // Aggregate products with the same unit to display them in the cart
  const aggregatedProducts = useMemo(() => {
    const productMap = cartProducts.reduce((acc, product) => {
      const key = `${product.title}-${product.unit}`;
      if (acc[key]) {
        acc[key].quantity += product.quantity;
      } else {
        acc[key] = { ...product };
      }
      return acc;
    }, {});

    return Object.values(productMap);
  }, [cartProducts]);

  return (
    <div>
      <div className={styles.cartbg}>
        <div className={styles.section}>
          <div className={styles.left}>
            {/* Display a table with cart details */}
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
                        alt="Product Image"
                        height={30}
                        width={30}
                      />
                    </td>
                    <td>{product.quantity}</td>
                    <td>{product.unit}</td>
                    <td>₦{product.price}</td>
                    <td>₦ {product.price * product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.right}>
            <div className={styles.wrapper}>
              <h2 className={styles.title}>CART TOTAL</h2>
              <div className={styles.totalText}>
                <div className={styles.totalTextTitle}>
                  SubTotal:<b>₦ {cart.total}</b>
                </div>
              </div>
              <div className={styles.totalText}>
                <div className={styles.totalTextTitle}>
                  Discount:<b>₦ 0.00</b>
                </div>
              </div>
              <div className={styles.totalText}>
                <div className={styles.totalTextTitle}>
                  Logistics:<b>$0.00</b>
                </div>
              </div>
              <div className={styles.totalText}>
                <div className={styles.totalTextTitle}>
                  Total:<b>₦ {cart.total}</b>
                </div>
                <div className={styles.checkout}>
                  {/* Checkout button that initializes Paystack payment */}
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => {
                      const orderData = {
                        products: aggregatedProducts.map((product) => ({
                          productId: product._id, // MongoDB's _id
                          title: product.title,
                          quantity: product.quantity,
                          unit: product.unit,
                          price: product.price,
                          totalPrice: product.quantity * product.price,
                        })),
                        total: cart.total,
                      };
                      handlePaystackCheckout(orderData, dispatch); // Call the Paystack integration
                    }}
                  >
                    CHECKOUT NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.imgContainer}>
          {/* Display the farm logo */}
          <Image
            src="/Farm logo.png"
            alt="Farm Icon"
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default CartContent;
