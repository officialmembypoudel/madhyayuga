import mongoose from "mongoose";

const unblockRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "listings",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  unblocked: {
    type: Boolean,
    default: false,
  },
});

unblockRequestSchema.pre("find", function (next) {
  try {
    this.populate("user", "name email phone avatar");
    this.populate("listing", "name");
    next();
  } catch (error) {
    console.log(error.message, "failed to populate user and listing");
  }
});

export const unblockRequestModel = mongoose.model(
  "unblockRequest",
  unblockRequestSchema
);
