// /app/api/delivery-choice/route.js
import Delivery from "@/libs/models/Delivery";
import { ConnectDB } from "@/libs/config/db";

export async function POST(req) {
  await ConnectDB();

  try {
    const body = await req.json();
    const { orderId, userId, type, region, pickupLocation, deliveryAddress } =
      body;

    if (!orderId || !userId || !type || !region) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const delivery = new Delivery({
      orderId,
      userId,
      type,
      region,
      ...(type === "Pickup" && { pickupLocation }),
      ...(type === "Delivery" && { deliveryAddress }),
    });

    await delivery.save();

    return new Response(
      JSON.stringify({ message: "Delivery choice saved successfully!" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to save delivery choice" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  await ConnectDB();

  try {
    const deliveries = await Delivery.find();
    return new Response(JSON.stringify(deliveries), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch delivery choices" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
