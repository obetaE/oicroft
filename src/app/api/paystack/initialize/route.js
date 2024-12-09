import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import UserModel from "@/libs/models/UserModel";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request) {
  await ConnectDB();

  try {
    // Retrieve the user session using `auth()`
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "User session not found or email is missing" },
        { status: 401 }
      );
    }

    // Fetch user details from the database using the session email
    const user = await UserModel.findOne({ email: session.user.email });

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "User not found or email missing" },
        { status: 404 }
      );
    }

    // Parse the request body for payment details
    const { amount, metadata } = await request.json();

    // Initialize the Paystack payment
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount,
          metadata,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Paystack Error:", error);
      throw new Error(error.message || "Failed to initialize payment");
    }

    const data = await response.json();
    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error("Paystack initialization error:", err.message);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
