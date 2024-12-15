import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";

// Fetch all orders
export async function GET(request) {
  await ConnectDB();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  await ConnectDB();

  try {
    // Populate userId to retrieve user details
    const query = userId ? { userId } : {}; // If userId is provided, filter by it
    const orders = await Order.find(query).populate("userId", "username email");
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}
