import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";
import { Product } from "@/libs/models/Product";

export async function GET(request) {
  await ConnectDB();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const query = userId ? { userId } : {};
    const orders = await Order.find(query).populate("userId", "username email");

    // Validate orders and filter unpaid ones
    const validatedOrders = [];
    const rollbackPromises = [];

    for (const order of orders) {
      if (!order.deliveryDate || isNaN(new Date(order.deliveryDate))) {
        console.error(`Invalid deliveryDate for order: ${order._id}`);
        continue; // Skip invalid orders
      }

      if (!order.isPaid) {
        console.log(
          `Unpaid order detected: ${order._id}. Reversing stock and deleting.`
        );

        // Rollback stock for all products in the unpaid order
        rollbackPromises.push(
          ...order.products.map(async (product) => {
            const dbProduct = await Product.findById(product.productId);
            if (dbProduct) {
              const selectedUnit = dbProduct.prices.find(
                (item) => item.unit === product.unit
              );
              if (selectedUnit) {
                selectedUnit.stock += product.quantity;
                await dbProduct.save();
                console.log(
                  `Stock reversed for ${dbProduct.title} (${product.unit}): New stock: ${selectedUnit.stock}`
                );
              }
            }
          })
        );

        // Delete the unpaid order
        await Order.findByIdAndDelete(order._id);
        continue; // Skip adding this order to the validated list
      }

      validatedOrders.push(order); // Add paid orders to the validated list
    }

    // Wait for all stock rollback promises to complete
    await Promise.all(rollbackPromises);

    return NextResponse.json(validatedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await ConnectDB();

  try {
    const { deliveryDate, status } = await request.json();

    if (!deliveryDate || !status) {
      return NextResponse.json(
        { message: "Delivery date and status are required" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(deliveryDate);
    if (isNaN(parsedDate)) {
      return NextResponse.json(
        { message: "Invalid delivery date provided" },
        { status: 400 }
      );
    }

    // Find and update orders
    const result = await Order.updateMany(
      { deliveryDate: parsedDate },
      { $set: { status } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No orders found with the given delivery date" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Orders updated successfully",
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating orders:", error.message);
    return NextResponse.json(
      { message: "Failed to update orders", error: error.message },
      { status: 500 }
    );
  }
}
