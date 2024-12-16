// src/app/api/session/route.js
import { auth } from "@/auth";
import {Order} from "@/libs/models/Order";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    // Fetch the current order for the user, if it exists
    const currentOrder = await Order.findOne({
      userId: session.user.id,
      status: "Pending", // Adjust this based on your order statuses
    });

    return new Response(
      JSON.stringify({
        user: {
          ...session.user,
          currentOrderId: currentOrder?._id || null, // Include current order ID if found
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving session:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve session" }),
      {
        status: 500,
      }
    );
  }
}
