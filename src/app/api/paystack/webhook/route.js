import crypto from "crypto";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";
import { Product } from "@/libs/models/Product";

export async function POST(request) {
  await ConnectDB(); // Ensure database is connected
  const secret = process.env.PAYSTACK_SECRET_KEY; // Secret from Paystack

  try {
    const body = await request.text(); // Raw body for signature verification
    const signature = request.headers.get("x-paystack-signature");

    // Verify Paystack's signature
    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Webhook received:", event);

    if (event.event === "charge.success") {
      console.log("Payment successful:", event.data);
      const { reference } = event.data;

      // Update order status to "Paid"
      const order = await Order.findOne({ reference });
      if (!order) {
        console.error("Order not found for reference:", reference);
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      order.status = "Paid";
      await order.save();
      console.log("Order updated successfully:", order);
    } else if (event.event === "charge.failed") {
      console.log("Payment failed:", event.data);
      const { reference } = event.data;

      // Reverse stock for the failed payment
      const order = await Order.findOne({ reference });
      if (!order) {
        console.error("Order not found for reference:", reference);
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      if (order.status === "Paid") {
        console.log("Order already marked as paid; no stock reversal needed.");
        return NextResponse.json({ message: "Order already paid" });
      }

      // Rollback stock for all products in the order
      const rollbackPromises = order.products.map(async (product) => {
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
      });

      await Promise.all(rollbackPromises);

      // Update order status to "Failed"
      order.status = "Failed";
      await order.save();
      console.log("Order marked as failed, and stock reversed.");
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
