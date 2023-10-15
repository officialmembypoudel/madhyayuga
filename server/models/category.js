import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  iconFamily: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#4C4646",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const categoryModel = mongoose.model("category", categorySchema);
