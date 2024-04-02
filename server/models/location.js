import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

export const locationModel = mongoose.model("location", locationSchema);
