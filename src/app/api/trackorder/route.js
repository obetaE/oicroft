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
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const deliveryDate = calculateDeliveryDate();
    const updatedProducts = [];

    for (const product of products) {
      const existingProduct = await Product.findOne({
        $or: [{ productId: product.productId }, { _id: product.productId }],
      });

      if (!existingProduct) {
        return NextResponse.json(
          { message: `Product ${product.productId} not found` },
          { status: 404 }
        );
      }

      const selectedUnit = existingProduct.prices.find(
        (item) => item.unit === product.unit || !item.unit
      );

      if (!selectedUnit || selectedUnit.stock < product.quantity) {
        return NextResponse.json(
          {
            message: `Insufficient stock for ${existingProduct.title} (${
              product.unit
            }). Available: ${selectedUnit?.stock || 0}`,
          },
          { status: 400 }
        );
      }

      selectedUnit.stock -= product.quantity;
      updatedProducts.push({ product: existingProduct, selectedUnit });
    }

    try {
      await Promise.all(updatedProducts.map(({ product }) => product.save()));

      const otpToken = Math.floor(1000 + Math.random() * 900000);
      const newOrder = await Order.create({
        userId,
        reference,
        products: products.map((product) => ({
          ...product,
          totalPrice: product.quantity * product.price,
        })),
        total,
        deliveryDate,
        otpToken,
        status: "Paid",
        orderDate: new Date(),
      });

      return NextResponse.json(
        { message: "Order created successfully", order: newOrder },
        { status: 201 }
      );
    } catch (error) {
      for (const { product, selectedUnit } of updatedProducts) {
        selectedUnit.stock += selectedUnit.stock;
        await product.save();
      }
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}
