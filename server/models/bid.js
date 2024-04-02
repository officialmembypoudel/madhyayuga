import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "listings",
    required: true,
  },
  for: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "listings",
    required: true,
  },
});

export const bidModel = mongoose.model("bid", bidSchema);
