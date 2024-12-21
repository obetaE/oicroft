import { NextResponse } from "next/server";
import { ConnectDB } from "@/libs/config/db";
import { Order } from "@/libs/models/Order";
import { Product } from "@/libs/models/Product";
import nodemailer from "nodemailer";

export async function GET(request) {
  await ConnectDB();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const query = userId ? { userId } : {};
    const orders = await Order.find(query).populate("userId", "username email");

    // Validate orders and filter unpaid ones
    const validatedOrders = [];
    const rollbackPromises = [];

    for (const order of orders) {
      if (!order.deliveryDate || isNaN(new Date(order.deliveryDate))) {
        console.error(`Invalid deliveryDate for order: ${order._id}`);
        continue; // Skip invalid orders
      }

      if (!order.isPaid) {
        console.log(
          `Unpaid order detected: ${order._id}. Reversing stock and deleting.`
        );

        // Rollback stock for all products in the unpaid order
        rollbackPromises.push(
          ...order.products.map(async (product) => {
            const dbProduct = await Product.findById(product.productId);
            if (dbProduct) {
              const selectedUnit = dbProduct.prices.find(
                (item) => item.unit === product.unit
              );
              if (selectedUnit) {
                selectedUnit.stock += product.quantity;
                await dbProduct.save();
                console.log(
                  `Stock reversed for ${dbProduct.title} (${product.unit}): New stock: ${selectedUnit.stock}`
                );
              }
            }
          })
        );

        // Delete the unpaid order
        await Order.findByIdAndDelete(order._id);
        continue; // Skip adding this order to the validated list
      }

      validatedOrders.push(order); // Add paid orders to the validated list
    }

    // Wait for all stock rollback promises to complete
    await Promise.all(rollbackPromises);

    return NextResponse.json(validatedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await ConnectDB();

  try {
    const { deliveryDate, status } = await request.json();

    if (!deliveryDate || !status) {
      return NextResponse.json(
        { message: "Delivery date and status are required" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(deliveryDate);
    if (isNaN(parsedDate)) {
      return NextResponse.json(
        { message: "Invalid delivery date provided" },
        { status: 400 }
      );
    }

    // Find orders to update
    const orders = await Order.find({ deliveryDate: parsedDate }).populate(
      "userId",
      "email username"
    );

    if (!orders.length) {
      return NextResponse.json(
        { message: "No orders found with the given delivery date" },
        { status: 404 }
      );
    }

    // Update the status of the orders
    const result = await Order.updateMany(
      { deliveryDate: parsedDate },
      { $set: { status } }
    );

    if (status === "Logistics") {
      for (const order of orders) {
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
                <img src="cid:headerImage" alt="Oicroft Header" style="width: 100%; min-width: 600px;" />

                <div style="padding: 1rem;">
                  <h1>Your Order is Ready</h1>
                  <p>Your order has arrived at the branch location. You can pick it up or await delivery starting tomorrow.</p>
                  <p>Thank you for choosing Oicroft!</p>
                </div>

                <div style="background-color: #19831c; color: white; text-align: center; padding: 1rem; margin-top: 1rem;">
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
                cid: "headerImage",
              },
              {
                filename: "Email.png",
                path: "./public/Email.png",
                cid: "Email",
              },
              {
                filename: "Facebook.png",
                path: "./public/Facebook.png",
                cid: "Facebook",
              },
              {
                filename: "Twitter.png",
                path: "./public/Twitter.png",
                cid: "Twitter",
              },
              {
                filename: "Instagram.png",
                path: "./public/Instagram.png",
                cid: "Instagram",
              },
            ],
          };

          await transporter.sendMail(mailOptions);
          console.log("Logistics email sent to:", order.userId.email);
        } catch (emailError) {
          console.error(
            "Error sending email for order:",
            order._id,
            emailError.message
          );
        }
      }
    }

    return NextResponse.json(
      {
        message: "Orders updated successfully",
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating orders:", error.message);
    return NextResponse.json(
      { message: "Failed to update orders", error: error.message },
      { status: 500 }
    );
  }
}
