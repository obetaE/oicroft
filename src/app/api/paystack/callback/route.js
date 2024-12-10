import { NextResponse } from "next/server";

export async function GET(req) {
  console.log("Handling user callback...");
  try {
    const reference = req.nextUrl.searchParams.get("reference");

    if (!reference) {
      console.error("Callback failed: Missing reference.");
      return NextResponse.redirect(
        `${
          process.env.BASE_URL || req.nextUrl.origin
        }/checkout?error=missing_reference`
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.data?.status === "success") {
      console.log("Callback successful. Redirecting to success page.");
      return NextResponse.redirect(
        `${process.env.BASE_URL || req.nextUrl.origin}/checkout/success`
      );
    } else {
      console.error("Callback verification failed:", data);
      return NextResponse.redirect(
        `${process.env.BASE_URL || req.nextUrl.origin}/checkout/failure`
      );
    }
  } catch (error) {
    console.error("Error in callback handler:", error.message);
    return NextResponse.redirect(
      `${
        process.env.BASE_URL || req.nextUrl.origin
      }/checkout?error=callback_failed`
    );
  }
}
