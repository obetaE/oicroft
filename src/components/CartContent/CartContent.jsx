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

    dispatch(reset()); // Reset cart after successful order creation
    return data;
  } catch (err) {
    console.error("Order creation error:", err.message);
    throw err;
  }
};

const deleteOrder = async (orderId) => {
  try {
    console.log("Deleting order with ID:", orderId);
    await axios.delete(`/api/trackorder/${orderId}`);
    console.log("Order deleted successfully.");
  } catch (err) {
    console.error("Error deleting order:", err.message);
  }
};

const handlePaystackCheckout = async (orderData, dispatch, user) => {
  if (!user || !user.email || !user.id) {
    alert("User details are missing. Please log in.");
    return;
  }

  try {
    console.log("Initializing Paystack checkout with:", orderData);

    // Step 1: Initialize Paystack payment
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
      throw new Error("Failed to initialize payment. Please try again.");
    }

    const { authorization_url, reference } = response.data;

    // Step 2: Create order with reference
    const order = await createOrder(
      { ...orderData, reference, userId: user.id },
      dispatch
    );

    // Step 3: Redirect to Paystack checkout
    window.location.href = authorization_url;

    // Optional: Cleanup order on page unload
    window.addEventListener("beforeunload", () => {
      deleteOrder(order._id);
    });
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
  const [deliveryChosen, setDeliveryChosen] = useState(false);
  const [type, setType] = useState(""); // Pickup or Delivery
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/session");
        if (!response.ok) throw new Error("Session fetch failed");
        const data = await response.json();
        setUser(data.user || null);
      } catch (err) {
        console.error("Session fetch error:", err.message);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error.message);
      }
    };
    fetchLocations();
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

const handleDeliveryChoiceSubmit = (e) => {
  e.preventDefault();
  setDeliveryChosen(true);
};


  const handleCheckout = () => {
    const orderData = {
      userId: user.id,
      products: aggregatedProducts.map((product) => ({
        productId: product.id || product._id,
        title: product.title,
        img: product.img,
        price: product.price,
        quantity: product.quantity,
        unit: product.unit,
      })),
      total: cart.total,
      deliveryOption: {
        type,
        locationId: locationId || null,
        ...(type === "Delivery" && { deliveryAddress }),
      },
    };

    handlePaystackCheckout(orderData, dispatch, user);
  };

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
                <b>Total: ₦{cart.total}</b>
              </div>

              {!showCheckout && (
                <button
                  className={styles.checkout}
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Delivery Choice
                </button>
              )}

              {showCheckout && !deliveryChosen && (
                <form
                  className={styles.form}
                  onSubmit={handleDeliveryChoiceSubmit}
                >
                  <h2 className={styles.title}>Choose Delivery Option</h2>
                  <div className={styles.radioGroup}>
                    <label>
                      <input
                        type="radio"
                        value="Pickup"
                        checked={type === "Pickup"}
                        onChange={(e) => setType(e.target.value)}
                        required
                      />
                      Pickup
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="Delivery"
                        checked={type === "Delivery"}
                        onChange={(e) => setType(e.target.value)}
                        required
                      />
                      Delivery
                    </label>
                  </div>

                  <label>
                    Select Region/Location:
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      required
                    >
                      <option value="">Select a location</option>
                      {locations.map((loc) => (
                        <option key={loc._id} value={loc._id}>
                          {loc.pickup?.region?.state ||
                            loc.delivery?.region?.state}{" "}
                          -{" "}
                          {loc.pickup?.location ||
                            loc.delivery?.area?.zone ||
                            "N/A"}
                        </option>
                      ))}
                    </select>
                  </label>

                  {type === "Delivery" && (
                    <label>
                      Delivery Address:
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                      />
                    </label>
                  )}

                  <button type="submit">Submit Delivery Choice</button>
                </form>
              )}

              {deliveryChosen && (
                <button className={styles.checkout} onClick={handleCheckout}>
                  Proceed to Payment
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
