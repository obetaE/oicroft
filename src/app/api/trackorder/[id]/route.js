import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";

export default async function handler(req, res) {
  const { id } = req.query; // Extract the dynamic order ID
  await ConnectDB();

  try {
    if (req.method === "GET") {
      // Fetch order by ID
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    } else if (req.method === "PUT") {
      // Update order by ID
      const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json(updatedOrder);
    } else if (req.method === "DELETE") {
      // Delete order by ID
      await Order.findByIdAndDelete(id);
      return res.status(200).json({ message: "Order deleted successfully" });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
}
