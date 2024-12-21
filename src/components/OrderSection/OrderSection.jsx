"use client";
import React, { useState, useEffect } from "react";
import PageLoader from "@/components/PageLoader/PageLoader";
import styles from "./OrderSection.module.css";

export default function OrderSection() {
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");

        if (!response.ok) {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("API response is not an array:", data);
          setLoading(false);
          return;
        }

        const validOrders = data.filter((order) => {
          if (!order.deliveryDate || isNaN(new Date(order.deliveryDate))) {
            console.warn(
              `Skipping order with invalid deliveryDate: ${order._id}`
            );
            return false;
          }
          return true;
        });

        const grouped = validOrders.reduce((acc, order) => {
          const formattedDate = new Date(
            order.deliveryDate
          ).toLocaleDateString();
          if (!acc[formattedDate]) acc[formattedDate] = [];
          acc[formattedDate].push({
            ...order,
            originalDate: order.deliveryDate,
          }); // Include originalDate
          return acc;
        }, {});

        const groupedArray = Object.entries(grouped).sort(
          ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
        );

        setGroupedOrders(groupedArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (deliveryDate, newStatus) => {
    try {
      const originalDate = groupedOrders.find(
        ([date]) => date === deliveryDate
      )?.[1]?.[0]?.originalDate;

      if (!originalDate) {
        console.error("Original delivery date not found for:", deliveryDate);
        return;
      }

      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryDate: originalDate, // Use the original ISO date
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating orders:", errorData.message);
        return;
      }

      const { message, modifiedCount } = await response.json();
      console.log(`${message}. Orders updated: ${modifiedCount}`);

      refreshData();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const refreshData = async () => {
    try {
      const updatedResponse = await fetch("/api/orders");
      const updatedData = await updatedResponse.json();

      const updatedGrouped = updatedData.reduce((acc, order) => {
        const formattedDate = new Date(order.deliveryDate).toLocaleDateString();
        if (!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push({ ...order, originalDate: order.deliveryDate });
        return acc;
      }, {});

      setGroupedOrders(
        Object.entries(updatedGrouped).sort(
          ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
        )
      );
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statuses = ["Paid", "Packaged", "Logistics", "Received"];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[currentIndex + 1] || currentStatus;
  };

  const getPreviousStatus = (currentStatus) => {
    const statuses = ["Paid", "Packaged", "Logistics", "Received"];
    const currentIndex = statuses.indexOf(currentStatus);
    return currentIndex > 0 ? statuses[currentIndex - 1] : currentStatus;
  };

  return (
    <div>
      {loading ? (
        <PageLoader />
      ) : groupedOrders.length > 0 ? (
        groupedOrders.map(([deliveryDate, orders], index) => (
          <div key={index} className={styles.orderGroup}>
            <div className={styles.groupHeader}>
              <button
                className={styles.nextStageButton}
                onClick={() =>
                  updateOrderStatus(
                    deliveryDate,
                    getNextStatus(orders[0].status) // Assume all orders have the same status
                  )
                }
              >
                Next Stage (All)
              </button>
              <button
                className={styles.nextStageButton}
                onClick={() =>
                  updateOrderStatus(
                    deliveryDate,
                    getPreviousStatus(orders[0].status)
                  )
                }
              >
                Previous Stage (All)
              </button>
              <h2>Delivery Date: {deliveryDate}</h2>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>OrderId</th>
                  <th>Name</th>
                  <th>Customer Email</th>
                  <th>Code</th>
                  <th>Total Price</th>
                  <th>Delivery Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.userId.username}</td>
                    <td>{order.userId.email}</td>
                    <td>{order.otpToken}</td>
                    <td>₦{order.total.toFixed(2)}</td>
                    <td>Delivery</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
}
