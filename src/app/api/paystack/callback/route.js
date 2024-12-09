import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect("/checkout?error=missing_reference");
  }

  try {
    // Validate payment using Paystack API
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    if (data.status === "success") {
      // Redirect to success page
      return NextResponse.redirect("/checkout/success");
    } else {
      // Redirect to failure page
      return NextResponse.redirect("/checkout/failure");
    }
  } catch (error) {
    console.error("Paystack callback error:", error);
    return NextResponse.redirect("/checkout?error=callback_error");
  }
}
