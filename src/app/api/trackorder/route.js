import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";
import { Product } from "@/libs/models/Product";

// Helper function to calculate delivery date
const calculateDeliveryDate = () => {
  const now = new Date();
  const currentDay = now.getDay();

  const daysToThursday =
    currentDay <= 4 ? 4 - currentDay : 4 + (7 - currentDay);
  const thursday = new Date(now);
  thursday.setDate(now.getDate() + daysToThursday);
  thursday.setHours(0, 0, 0, 0);

  const wednesday = new Date(thursday);
  wednesday.setDate(thursday.getDate() + 6);
  wednesday.setHours(23, 59, 59, 999);

  const saturday = new Date(wednesday);
  saturday.setDate(wednesday.getDate() + 3);
  saturday.setHours(12, 0, 0, 0);

  if (now < thursday) {
    saturday.setDate(saturday.getDate() - 7);
  } else if (now > wednesday) {
    saturday.setDate(saturday.getDate() + 7);
  }

  return saturday;
};

// API Route
export async function POST(request) {
  await ConnectDB();
  try {
    const { products, total } = await request.json();
    const deliveryDate = calculateDeliveryDate();

    for (const product of products) {
      const existingProduct = await Product.findById(product.productId);
      if (!existingProduct) {
        return NextResponse.json(
          { message: `Product ${product.productId} not found` },
          { status: 404 }
        );
      }

      const selectedUnit = existingProduct.prices.find(
        (item) => item.unit === product.unit
      );

      if (!selectedUnit) {
        return NextResponse.json(
          {
            message: `Unit '${product.unit}' does not exist for ${existingProduct.title}`,
          },
          { status: 400 }
        );
      }

      if (selectedUnit.stock < product.quantity) {
        return NextResponse.json(
          {
            message: `Insufficient stock for ${existingProduct.title} (${product.unit}). Available: ${selectedUnit.stock}`,
          },
          { status: 400 }
        );
      }

      // Deduct stock for the specific unit
      selectedUnit.stock -= product.quantity;
      await existingProduct.save();
    }

    // Create the order
    const newOrder = await Order.create({
      products: products.map((product) => ({
        ...product,
        totalPrice: product.quantity * product.price,
      })),
      total,
      deliveryDate,
      status: "Pending",
      date: new Date(),
    });

    return NextResponse.json(
      { message: "Order created successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}
