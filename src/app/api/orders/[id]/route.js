import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";

// Fetch a specific order by ID
export async function GET(request, { params }) {
  const { id } = await params;
  await ConnectDB();

  try {
    const order = await Order.findById(id).populate("userId", "username email");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch order", error: error.message },
      { status: 500 }
    );
  }
}

// Update a specific order by ID
export async function PUT(request, { params }) {
  const { id } = await params;
  await ConnectDB();

  try {
    const updatedData = await request.json();
    const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).populate("userId", "username email");

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update order", error: error.message },
      { status: 500 }
    );
  }
}
