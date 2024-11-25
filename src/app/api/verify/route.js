import UserModel from "../models/UserModel";
import { ConnectDB } from "@/config/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { token } = req.query;

    try {
      ConnectDB();
      const user = await UserModel.findOne({ verificationToken: token });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      user.isVerified = true;
      user.verificationToken = undefined; // Remove token after verification
      await user.save();

      res.status(200).json({ message: "Email successfully verified" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to verify email" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
