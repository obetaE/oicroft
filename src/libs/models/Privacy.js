import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PrivacyModel =
  mongoose.models?.privacy || mongoose.model("privacy", Schema);

export default PrivacyModel;
