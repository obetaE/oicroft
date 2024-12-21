import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";

export async function POST(request) {
  await ConnectDB(); // Ensure database is connected
  const secret = process.env.PAYSTACK_SECRET_KEY; // Secret from Paystack

  try {
    const body = await request.text(); // Raw body for signature verification
    const signature = request.headers.get("x-paystack-signature");

    // Verify Paystack's signature
    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Webhook received:", event);

    if (event.event === "charge.success") {
      console.log("Payment successful:", event.data);
      const { reference } = event.data;

      // Update order status to "Paid" and isPaid to true
      const order = await Order.findOne({ reference }).populate("userId"); // Populate user details
      if (!order) {
        console.error("Order not found for reference:", reference);
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      if (order.isPaid) {
        console.log("Order already marked as paid.");
        return NextResponse.json({ message: "Order already paid" });
      }

      order.status = "Paid";
      order.isPaid = true; // Mark the order as paid
      await order.save();
      console.log("Order updated successfully:", order);

      // Send email to the user
      await sendOrderConfirmationEmail(order);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Function to send an email with order details
async function sendOrderConfirmationEmail(order) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: `"Oicroft" <${process.env.EMAIL_USER}>`,
      to: order.userId.email, // Assumes userId is populated and contains email
      subject: "Payment Confirmation - Order Recieved",
      html: `
        <div style="font-family: Arial, sans-serif;">
      <!-- Header -->
      <img src="cid:headerImage" alt="Oicroft Header" style="width: 100%; min-width: 600px;" />

      <!-- Content -->
      <div style="padding: 1rem;">
       <h1>Thank You for Your Purchase!</h1>
          <p>Hello ${order.userId.username || "Customer"},</p>
          <p>We have received your order. Here are the details:</p>
          <ul>
            <li><strong>Reference:</strong> ${order.reference}</li>
            <li><strong>Total:</strong> ${order.total}</li>
            <li><strong>Delivery Date:</strong> ${order.deliveryDate.toDateString()}</li>
            <li><strong>OTP:</strong> ${order.otpToken}</li>
          </ul>
          <p>Thank you for choosing Oicroft!</p>
          <p>If you have any questions, feel free to contact us at oicroftco@gmail.com.</p>

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
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent to:", order.userId.email);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
}
