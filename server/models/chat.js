import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "listings",
    },
  },
  {
    timestamps: true,
  }
);

export const chatModel = mongoose.model("chats", chatSchema);
