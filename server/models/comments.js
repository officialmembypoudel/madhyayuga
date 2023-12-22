import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "listings",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      text: {
        type: String,
        required: false,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const commentModel = mongoose.model("comment", commentSchema);
