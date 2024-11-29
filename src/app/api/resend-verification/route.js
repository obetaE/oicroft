import { ConnectDB } from "@/libs/config/db";
import UserModel from "@/libs/models/UserModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  const body = await req.json(); // Parse request body
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await ConnectDB();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "User is already verified" },
        { status: 400 }
      );
    }

    // Generate a new verification token
    user.verificationToken = crypto.randomBytes(32).toString("hex");
    await user.save();

    // Resend verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `${process.env.BASE_URL}/verify?token=${user.verificationToken}`;
    await transporter.sendMail({
      from: `"Oicroft" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Resend: Verify Your Email",
      html: `
      <div style="font-family: Arial, sans-serif;">
      <!-- Header -->
      <img src="cid:headerImage" alt="Oicroft Header" style="width: 100%; min-width: 600px;" />

       <!-- Content -->
      <div style="padding: 1rem;">
        <h1>Verify Your Email Address</h1>
        <p>To complete the creation of your new Oicroft Account, please follow the link below to confirm your email</p>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
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

    return NextResponse.json({
      message: "Verification link resent to your email",
    });
  } catch (err) {
    console.error("Error resending verification link:", err);
    return NextResponse.json(
      { error: "Failed to resend verification link" },
      { status: 500 }
    );
  }
}
