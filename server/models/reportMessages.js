import mongoose from "mongoose";

const reportMessagesSchema = new mongoose.Schema({
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "report",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const reportMessagesModel = mongoose.model(
  "reportMessages",
  reportMessagesSchema
);
