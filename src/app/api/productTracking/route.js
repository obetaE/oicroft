import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";
import { Product } from "@/libs/models/Product";

// Fetch aggregated product data grouped by deliveryDate
export async function GET(request) {
  await ConnectDB();

  try {
    const orders = await Order.find().populate({
      path: "products.productId",
      model: "Product",
      select: "title img", // Fetch only necessary fields
    });

    const groupedProducts = orders.reduce((acc, order) => {
      // Validate deliveryDate
      if (!order.deliveryDate || isNaN(new Date(order.deliveryDate))) {
        console.error(`Invalid deliveryDate for order: ${order._id}`);
        return acc; // Skip this order
      }

      const date = new Date(order.deliveryDate).toLocaleDateString();

      if (!acc[date]) acc[date] = {};

      // Aggregate product quantities and details
      order.products.forEach((product) => {
        const productId = product.productId?._id;
        const productName = product.productId?.title;

        if (!productId || !productName) return; // Skip invalid products

        if (!acc[date][productId]) {
          acc[date][productId] = {
            name: productName,
            img: product.productId.img,
            totalQuantity: 0,
          };
        }

        acc[date][productId].totalQuantity += product.quantity;
      });

      return acc;
    }, {});

    // Convert groupedProducts object into an array
    const response = Object.entries(groupedProducts).map(
      ([date, products]) => ({
        deliveryDate: date,
        products: Object.values(products),
      })
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching product data:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch product data", error: error.message },
      { status: 500 }
    );
  }
}
