import mongoose from "mongoose";

export const reviewsSchema = new mongoose.Schema({
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
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reviewsSchema.pre("find", async function (next) {
  try {
    await this.populate("user", "name email avatar phone");
    await this.populate("listing", "name description price location images");
    next();
  } catch (error) {
    console.log(error);
  }
});

reviewsSchema.pre("save", async function (next) {
  try {
    let user = await this.model("user").findById(this.user);
    user.rating = user.rating + this.rating;
    user.totalRating = user.totalRating + 1;
    await user.save();
  } catch (error) {
    console.log(error);
  }
});

const reviewsModel = mongoose.model("review", reviewsSchema);

export default reviewsModel;
