import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.text(); // Raw body for signature verification
    const secret = process.env.PAYSTACK_SECRET_KEY; // Secret from Paystack
    const signature = request.headers.get("x-paystack-signature");

    // Verify Paystack's signature
    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Webhook received:", event);

    if (event.event === "charge.success") {
      // Handle successful payment
      console.log("Payment successful:", event.data);
      // Update the order in your database here
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
