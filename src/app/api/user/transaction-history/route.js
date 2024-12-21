import { auth } from "@/auth";
import { Order } from "@/libs/models/Order";

export async function GET() {
  console.log("API called: /api/user/transaction-history [GET]");

  try {
    // Authenticate the user session
    const session = await auth();

    if (!session?.user) {
      console.error("User is not authenticated");
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    console.log("Authenticated user:", session.user);

    // Fetch all orders for the authenticated user
    const userOrders = await Order.find({ userId: session.user.id })
      .sort({ orderDate: -1 }) // Sort by orderDate (most recent first)
      .lean(); // Use lean for better performance

    if (!userOrders || userOrders.length === 0) {
      console.log("No orders found for user:", session.user.id);
      return new Response(
        JSON.stringify({
          message: "No transaction history available for this user.",
          orders: [],
        }),
        { status: 404 }
      );
    }

    console.log("Orders found for user:", userOrders);

    return new Response(
      JSON.stringify({
        message: "Transaction history retrieved successfully.",
        orders: userOrders,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transaction history:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve transaction history",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
