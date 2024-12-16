
"use client";
import React, { useEffect, useState } from "react";
import styles from "./CheckoutContent.module.css"
import axios from "axios";
import PageLoader from "@/components/PageLoader/PageLoader"
import Image from "next/image"


export default function CheckoutContent(){
     const [user, setUser] = useState(null); // Replacing useSession
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusMapping = {
    Paid: 0,
    Packaged: 1,
    Logistics: 2,
    Delivered: 3,
  };

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

  useEffect(() => {
    if (!user) return;

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders?userId=${user.id}`);
        setOrder(response.data[0]); // Assuming one active order per user
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user]);

  const statusClass = (index) => {
    const currentStatus = statusMapping[order?.status || "Paid"];
    if (index - currentStatus < 1) return styles.done;
    if (index - currentStatus === 1) return styles.inProgress;
    return styles.undone;
  };

  if (loading) {
    return (<PageLoader/>)
  }

  if (!order) {
    return <div className={styles.noOrder}>No active orders found.</div>;
  }
    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.row}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tr}>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className={styles.id}>{order.reference}</span>
                  </td>
                  <td>
                    <span className={styles.name}>{user?.email}</span>
                  </td>
                  <td>
                    <span className={styles.address}>
                      12 Oaks Morris Street
                    </span>
                  </td>
                  <td>
                    <span className={styles.total}>
                      ₦{order.total.toFixed(2)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.row}>
            {["Order Paid", "Order Packaged", "Logistics", "Recieved"].map(
              (step, index) => (
                <div key={index} className={statusClass(index)}>
                  <Image
                    src={`/${step.toLowerCase().replace(" ", "-")}.png`}
                    alt={step}
                    width={30}
                    height={30}
                  />
                  <span>{step}</span>
                  <div className={styles.checkedIcon}>
                    <Image
                      className={styles.checked}
                      src="/checked.png"
                      alt="Checked Icon"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.wrapper}>
            <h2 className={styles.title}>CART TOTAL</h2>
            <div className={styles.totalText}>
              <div className={styles.totalTextTitle}>
                SubTotal:<b>₦{order.total.toFixed(2)}</b>
              </div>
            </div>
            <div className={styles.totalText}>
              <div className={styles.totalTextTitle}>
                Total<b>₦{order.total.toFixed(2)}</b>
              </div>
              <button disabled type="button" className={styles.button}>
                {order.status}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}