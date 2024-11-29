import mongoose from "mongoose";
import crypto from "crypto";

const Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    number: {
      type: String,
      unique: true,
      max: 25,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      // required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: () => crypto.randomBytes(32).toString("hex"),
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isWorker: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      default: null, // Reset token for password reset
    },
    resetTokenExpiry: {
      type: Date, // Expiry time for the reset token
      default: null,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models?.user || mongoose.model("user", Schema);

export default UserModel;
