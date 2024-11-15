import mongoose from "mongoose";

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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isWorker: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models?.user || mongoose.model("user", Schema);

export default UserModel;
