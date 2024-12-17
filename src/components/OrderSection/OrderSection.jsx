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

       // Filter out orders with invalid deliveryDate
       const validOrders = data.filter((order) => {
         if (!order.deliveryDate || isNaN(new Date(order.deliveryDate))) {
           console.warn(
             `Skipping order with invalid deliveryDate: ${order._id}`
           );
           return false;
         }
         return true;
       });

       // Group orders by deliveryDate
       const grouped = validOrders.reduce((acc, order) => {
         const date = new Date(order.deliveryDate).toLocaleDateString();
         if (!acc[date]) acc[date] = [];
         acc[date].push(order);
         return acc;
       }, {});

       const groupedArray = Object.entries(grouped).sort(
         ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
       );

       setGroupedOrders(groupedArray);

       console.log("Orders fetched:", data);
       console.log("Grouped orders:", groupedArray);

     } catch (error) {
       console.error("Error fetching orders:", error);
     } finally {
       setLoading(false);
     }
   };

   fetchOrders();
 }, []);


  const handleNextStage = async (deliveryDate) => {
    try {
      const ordersToUpdate = groupedOrders.find(
        ([date]) => date === deliveryDate
      )?.[1];

      if (!ordersToUpdate) return;

      await Promise.all(
        ordersToUpdate.map((order) =>
          fetch(`/api/orders/${order._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: getNextStatus(order.status), // Determine the next stage
            }),
          })
        )
      );

      // Refresh data after update
      const updatedResponse = await fetch("/api/orders");
      const updatedData = await updatedResponse.json();

      // Validate that updatedData is an array
      if (!Array.isArray(updatedData)) {
        console.error("API response is not an array:", updatedData);
        return;
      }

      const updatedGrouped = updatedData.reduce((acc, order) => {
        const date = new Date(order.deliveryDate).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(order);
        return acc;
      }, {});
      setGroupedOrders(
        Object.entries(updatedGrouped).sort(
          ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statuses = ["Paid", "Packaged", "Logistics", "Received"];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[currentIndex + 1] || currentStatus; // Default to last stage
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
                onClick={() => handleNextStage(deliveryDate)}
              >
                Next Stage (All)
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
                    <td>${order.total.toFixed(2)}</td>
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
