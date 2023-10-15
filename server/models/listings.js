import mongoose from "mongoose";

const listingsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  views: {
    type: Number,
  },
  condition: {
    type: String,
    required: true,
  },
  with: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
});

export const listingsModel = mongoose.model("listings", listingsSchema);
