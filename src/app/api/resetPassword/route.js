import { ConnectDB } from "@/libs/config/db";
import UserModel from "@/libs/models/UserModel";
import argon2 from "argon2";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request body:", body); // Log the entire request body

    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      console.error("Validation error: Missing required fields");
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await ConnectDB();
    console.log("DB connected");

    console.log("Email received:", email);
    console.log("Token received:", token);

    const user = await UserModel.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.error("User not found or token invalid/expired");
      return new Response(
        JSON.stringify({
          error: "Invalid email or token, or token has expired",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("User found:", user);

    const hashedPassword = await argon2.hash(newPassword);
    console.log("Password hashed");

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    console.log("Password updated and user saved");

    return new Response(
      JSON.stringify({ message: "Password reset successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return new Response(JSON.stringify({ error: "Failed to reset password" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}




