import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";
import { Product } from "@/libs/models/Product";

const calculateDeliveryDate = () => {
  const now = new Date();

  const currentThursday = new Date(now);
  currentThursday.setDate(now.getDate() + ((4 - now.getDay() + 7) % 7));
  currentThursday.setHours(0, 0, 0, 0);

  const nextWednesday = new Date(currentThursday);
  nextWednesday.setDate(currentThursday.getDate() + 6);
  nextWednesday.setHours(23, 59, 59, 999);

  const deliverySaturday = new Date(nextWednesday);
  deliverySaturday.setDate(nextWednesday.getDate() + 3);
  deliverySaturday.setHours(12, 0, 0, 0);

  if (now >= currentThursday && now <= nextWednesday) {
    return deliverySaturday;
  }

  const nextBatchThursday = new Date(currentThursday);
  nextBatchThursday.setDate(currentThursday.getDate() + 7);

  const nextBatchWednesday = new Date(nextBatchThursday);
  nextBatchWednesday.setDate(nextBatchThursday.getDate() + 6);

  const nextBatchSaturday = new Date(nextBatchWednesday);
  nextBatchSaturday.setDate(nextBatchWednesday.getDate() + 3);

  return nextBatchSaturday;
};

export async function POST(request) {
  await ConnectDB();

  try {
    const requestData = await request.json();
    console.log("Received request data:", requestData);

    const { products, total, userId, reference } = requestData;

    if (!products || !total || !userId || !reference) {
      console.warn("Missing required fields:", {
        products,
        total,
        userId,
        reference,
      });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const deliveryDate = calculateDeliveryDate();
    console.log("Calculated delivery date:", deliveryDate);

    for (const product of products) {
      console.log("Processing product:", product);

      // Adjusted logic for finding the product
      const existingProduct = await Product.findOne({
        $or: [{ productId: product.productId }, { _id: product.productId }],
      });

      if (!existingProduct) {
        console.error(`Product ${product.productId} not found.`);
        return NextResponse.json(
          { message: `Product ${product.productId} not found` },
          { status: 404 }
        );
      }

      const selectedUnit = existingProduct.prices.find(
        (item) => item.unit === product.unit
      );

      if (!selectedUnit) {
        console.error(
          `Unit '${product.unit}' not found for product ${existingProduct.title}`
        );
        return NextResponse.json(
          {
            message: `Unit '${product.unit}' does not exist for ${existingProduct.title}`,
          },
          { status: 400 }
        );
      }

      if (selectedUnit.stock < product.quantity) {
        console.error(`Insufficient stock for ${existingProduct.title}:`, {
          requested: product.quantity,
          available: selectedUnit.stock,
        });
        return NextResponse.json(
          {
            message: `Insufficient stock for ${existingProduct.title} (${product.unit}). Available: ${selectedUnit.stock}`,
          },
          { status: 400 }
        );
      }

      selectedUnit.stock -= product.quantity;
      await existingProduct.save();
      console.log(
        `Updated stock for ${existingProduct.title}:`,
        selectedUnit.stock
      );
    }

    console.log("Creating new order...");
    const newOrder = await Order.create({
      userId,
      reference,
      products: products.map((product) => ({
        ...product,
        totalPrice: product.quantity * product.price,
      })),
      total,
      deliveryDate,
      status: "Pending",
      orderDate: new Date(),
    });

    console.log("Order created successfully:", newOrder);
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


