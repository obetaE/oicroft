import { NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request) {
  console.log("Initiating Paystack verification...");
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      console.error("Verification failed: Missing reference.");
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error(
        `Paystack verification failed: ${error.message || "Unknown error"}`
      );
      return NextResponse.json(
        { error: error.message || "Verification failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Verification successful. Data:", data);
    return NextResponse.json(data.data);
  } catch (err) {
    console.error("Paystack verification error:", err.message);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
