import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";

// Fetch all orders
export async function GET(request) {
  await ConnectDB();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const query = userId ? { userId } : {};
    const orders = await Order.find(query).populate("userId", "username email");

    // Validate deliveryDate
    const validatedOrders = orders.map((order) => {
      if (!order.deliveryDate || isNaN(new Date(order.deliveryDate))) {
        console.error(`Invalid deliveryDate for order: ${order._id}`);
        throw new Error(`Invalid deliveryDate for order: ${order._id}`);
      }
      return order;
    });

    return NextResponse.json(validatedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}

