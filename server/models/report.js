import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  public_id: String,
  url: String,
});

const reportSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "listings",
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: imageSchema,
  status: {
    type: String,
    default: "pending",
  },
  type: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  contactEmail: {
    type: String,
    required: true,
  },
});

reportSchema.index({ "$**": "text" }, { name: "text_index" });

export const reportModel = mongoose.model("report", reportSchema);
