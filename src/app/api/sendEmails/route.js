import nodemailer from "nodemailer";
import ConnectDB from "@/libs/ConnectDB";
import UserModel from "@/models/UserModel";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            ConnectDB();

            const users = await UserModel.find({}, "email"); // Fetch all user emails
            const emails = users.map((user) => user.email);

            const transporter = nodemailer.createTransport({
                service: "gmail", // Replace with your email service
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const emailPromises = emails.map((email) =>
                transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Notification",
                    text: req.body.emailContent,
                })
            );

            await Promise.all(emailPromises);
            res.status(200).json({ message: "Emails sent successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to send emails" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
