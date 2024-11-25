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

const SupportModel =
  mongoose.models?.support || mongoose.model("support", Schema);

export default SupportModel;
