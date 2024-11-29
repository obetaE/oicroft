import nodemailer from "nodemailer";
import { ConnectDB } from "@/libs/config/db";
import UserModel from "@/libs/models/UserModel";
import crypto from "crypto";

export async function POST(req) {
  const { email } = await req.json(); // Use `req.json()` for body parsing

  try {
    await ConnectDB();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 300000; // Token valid for 5 minutes

    // Save token to user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset link via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: `"Oicroft" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
      <div style="font-family: Arial, sans-serif;">
      <!-- Header -->
      <img src="cid:headerImage" alt="Oicroft Header" style="width: 100%; min-width: 600px;" />

       <!-- Content -->
      <div style="padding: 1rem;">
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password. The link is valid for 5 minutes:</p>
        <a href="${resetLink}">${resetLink}</a>
           </div>

           <!-- Footer -->
      <div style="
        background-color: #19831c; 
        color: white; 
        text-align: center; 
        padding: 1rem; 
        margin-top: 1rem;
      ">
        <p>Follow us on social media:</p>
        <a href="mailto:oicroftco@gmail.com"><img src="cid:Email" alt="Email" style="width: 32px; margin: 0 5px;" /></a>
        <a href="https://www.facebook.com/profile.php?id=61558022143571"><img src="cid:Facebook" alt="Facebook" style="width: 32px; margin: 0 5px;" /></a>
        <a href="https://x.com/Oicroft?t=xAfAW9Gz0kkdsk7pzjOcxQ&s=09"><img src="cid:Twitter" alt="Twitter" style="width: 32px; margin: 0 5px;" /></a>
        <a href="https://www.instagram.com/oicroft?igsh=MWY5a3Z2emt3eXBuZQ=="><img src="cid:Instagram" alt="Instagram" style="width: 32px; margin: 0 5px;" /></a>
      </div>

              </div>
      `,
      attachments: [
        {
          filename: "Email Header.png",
          path: "./public/Email Header.png",
          cid: "headerImage", // Same CID for referencing in the HTML
        },
        {
          filename: "Email.png",
          path: "./public/Email.png",
          cid: "Email", // Same CID for referencing in the HTML
        },
        {
          filename: "Facebook.png",
          path: "./public/Facebook.png",
          cid: "Facebook", // Same CID for referencing in the HTML
        },
        {
          filename: "Twitter.png",
          path: "./public/Twitter.png",
          cid: "Twitter", // Same CID for referencing in the HTML
        },
        {
          filename: "Instagram.png",
          path: "./public/Instagram.png",
          cid: "Instagram", // Same CID for referencing in the HTML
        },
      ],
    });

    return new Response(
      JSON.stringify({ message: "Password reset email sent" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to send reset email" }),
      { status: 500 }
    );
  }
}
