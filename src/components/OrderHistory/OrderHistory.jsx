"use client";

import React, { useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader/PageLoader"

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/user/transaction-history");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div><PageLoader/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Order Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Order Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Products
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Total
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Pickup Option
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul>
                      {order.products.map((product, index) => (
                        <li key={`${product.productId}-${index}`}>
                          {product.title}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₦{order.total}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.pickup.location ||
                      order.pickup.region?.state ||
                      "Not specified"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
