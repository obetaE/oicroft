import mongoose from "mongoose";
import { Order } from "../src/libs/models/Order.js"; // Adjust path
import UserModel from "../src/libs/models/UserModel.js"; // Adjust path

const migrateUserIds = async () => {
  const YOUR_DATABASE_URL =
    process.env.MONGODB_URL ||
    "mongodb+srv://oicroftco:oicroftco@cluster0.5phnm.mongodb.net/Oicroft-Logs?retryWrites=true&w=majority&appName=Cluster0";

 await mongoose.connect(YOUR_DATABASE_URL);
;

  try {
    const orders = await Order.find();
    for (const order of orders) {
      const user = await UserModel.findOne({ _id: order.userId });
      if (user) {
        // Update the userId without triggering validation
        order.set("userId", user._id, { strict: false });
        await order.save({ validateBeforeSave: false });
      } else {
        console.warn(`No user found for order: ${order._id}`);
      }
    }

    console.log("Migration completed!");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    mongoose.disconnect();
  }
};

migrateUserIds();
