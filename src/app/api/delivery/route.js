// /app/api/delivery/route.js
import Delivery from "@/libs/models/Delivery";
import Location from "@/libs/models/Location";
import { ConnectDB } from "@/libs/config/db";

export async function POST(req) {
  try {
    await ConnectDB();
    const body = await req.json();

    const { orderId, userId, locationId, option } = body;

    if (!orderId || !userId || !locationId || !option) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch the location by its ID
    const location = await Location.findById(locationId);
    if (!location) {
      return new Response(JSON.stringify({ error: "Location not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Prepare data for DeliverySchema
    const data =
      option === "Pickup"
        ? { pickup: location.pickup }
        : { delivery: location.delivery };

    // Create new Delivery document
    const newDelivery = new Delivery({
      orderId,
      userId,
      ...data,
    });

    await newDelivery.save();

    return new Response(
      JSON.stringify({
        message: "Delivery created successfully",
        delivery: newDelivery,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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
