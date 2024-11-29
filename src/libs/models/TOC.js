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

const TocModel =
  mongoose.models?.toc || mongoose.model("toc", Schema);

export default TocModel;
