import nodemailer from "nodemailer";
import { ConnectDB } from "@/libs/config/db";
import UserModel from "@/libs/models/UserModel";

export const POST = async (req) => {
  try {
    await ConnectDB();

    const users = await UserModel.find({}, "email");
    const emails = users.map((user) => user.email);

    if (!emails.length) {
      return new Response(
        JSON.stringify({ message: "No registered users found." }),
        {
          status: 404,
        }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const body = await req.json(); // Parse the request body
    const emailHTMLTemplate = (content) => `
      <div style="font-family: Arial, sans-serif;">
        <!-- Header -->
        <img src="cid:headerImage" alt="Oicroft Header" style="width: 100%; min-width: 600px;" />

        <!-- Content -->
        <div style="padding: 1rem;">
          ${content}
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
    `;

    const emailPromises = emails.map((email) =>
      transporter.sendMail({
        from: `"Oicroft" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Important Notification",
        html: emailHTMLTemplate(body.emailContent), // Insert dynamic email content
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
      })
    );

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ message: "Emails sent successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to send emails",
        details: error.message,
      }),
      { status: 500 }
    );
  }
};
