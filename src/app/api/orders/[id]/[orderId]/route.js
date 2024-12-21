import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";

// Connect to the database
await ConnectDB();

// GET: Fetch grouped orders for a specific group (id)
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const orders = await Order.find({ groupId: id })
      .populate("userId", "username email")
      .lean();

    if (!orders.length) {
      return NextResponse.json({ message: "No orders found" }, { status: 404 });
    }

    // Group orders by delivery date
    const groupedOrders = orders.reduce((acc, order) => {
      const date = new Date(order.deliveryDate).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(order);
      return acc;
    }, {});

    return NextResponse.json(groupedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update the status of an order
export async function PUT(request, { params }) {
  const { id, orderId } = params;

  try {
    const { status } = await request.json();

    // Find and update the specific order
    const order = await Order.findById(orderId).populate("userId", "email");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    order.status = status;
    await order.save();

    // Additional logic for specific statuses
    if (status === "Logistics") {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `Oicroft <${process.env.EMAIL_USER}>`,
          to: order.userId.email,
          subject: "Your Order is Ready for Pickup or Delivery",
          html: `<p>Your order is ready for pickup or delivery.</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Logistics email sent to:", order.userId.email);
      } catch (emailError) {
        console.error("Error Sending Email:", emailError.message);
      }
    }

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error.message);
    return NextResponse.json(
      { message: "Failed to update order", error: error.message },
      { status: 500 }
    );
  }
}

{
  /*
  if (status === "Logistics") {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `Oicroft <${process.env.EMAIL_USER}>`,
          to: order.userId.email,
          subject: "Your Order is Ready for Pickup or Delivery",
          html: `
          <div style="font-family: Arial, sans-serif;">
            <!-- Header -->
            <img src="cid:headerImage" alt="Oicroft Header" style="width: 100%; min-width: 600px;" />

            <!-- Content -->
            <div style="padding: 1rem;">
              <h1>Your Order is Ready</h1>
              <p>Your order has arrived at the branch location. You can pick it up or await delivery starting tomorrow.</p>
              <p>Thank you for choosing Oicroft!</p>
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
        };

        await transporter.sendMail(mailOptions);

        console.log("Logistics email sent to:", order.userId.email);
      } catch (emailError) {
        console.error("Error Sending Email:", emailError.message);
      }
    }

  */
}
