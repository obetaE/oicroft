import { ConnectDB } from "@/libs/config/db";
import UserModel from "@/libs/models/UserModel";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { _id, username, email, password, image, passwordRepeat, number } = req.body;

  if (password && password !== passwordRepeat) {
    return res.status(400).json({ error: "Passwords don't match" });
  }

  try {
    ConnectDB();

    const updatedData = { username, email, image, number };
    if (password) {
      const argon2 = require("argon2");
      updatedData.password = await argon2.hash(password);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(_id, updatedData, { new: true });
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update user" });
  }
}
