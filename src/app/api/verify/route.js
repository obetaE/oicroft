import UserModel from "@/libs/models/UserModel";
import { ConnectDB } from "@/libs/config/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url); // Extract query params
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    await ConnectDB();

    const user = await UserModel.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Mark user as verified and remove the token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({ message: "Email successfully verified" });
  } catch (err) {
    console.error("Error verifying email:", err);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
