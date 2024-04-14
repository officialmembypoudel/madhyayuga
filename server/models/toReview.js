import mongoose from "mongoose";

const toReviewSchema = new mongoose.Schema({
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "listings",
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    review: {
        type: String,
        default: "No review provided",
    },
    reviewed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},);


export const toReviewModel = mongoose.model("toReview", toReviewSchema);