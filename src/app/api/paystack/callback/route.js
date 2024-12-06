import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Callback received:", body);

    if (body.status === "success") {
      console.log("Payment verified successfully:", body);
      // Update order in your database here
    } else {
      console.log("Payment failed or pending:", body);
    }

    return NextResponse.json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Error handling callback:", error);
    return NextResponse.json(
      { error: "Failed to process callback" },
      { status: 500 }
    );
  }
}
