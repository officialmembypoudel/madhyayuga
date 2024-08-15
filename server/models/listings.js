import mongoose from "mongoose";

const listingsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    text: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  description: {
    type: String,
    required: true,
    text: true,
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
    text: true,
  },
  with: {
    type: String,
    required: true,
    text: true,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  // locationId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "location",
  //   required: true,
  // },
  credit: {
    type: Number,
    default: 0,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
  exchanged: {
    type: Boolean,
    default: false,
  },
  creditExpiry: {
    type: Date,
    default: Date.now(),
  },
});

listingsSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();

  next();
});

// listingsSchema.index(
//   {
//     name: "text",
//     description: "text",
//     location: "text",
//     with: "text",
//     // "categoryId.name": "text",
//     "$**": "text",
//   },
//   { name: "text_index", default_language: "none" }
// );
// listingsSchema.index({ "categoryId.name": 1 });
listingsSchema.index(
  { "$**": "text" },
  { name: "text_index", default_language: "none" }
);

listingsSchema.pre("deleteOne", async function (next) {
  try {
    await this.model("report").deleteMany({ listing: this._id });
    await this.model("unblockRequest").deleteMany({ listing: this._id });
    await this.model("favourites").deleteMany({ listing: this._id });
    await this.model("comment").deleteMany({ listingId: this._id });
    await this.model("chats").deleteMany({ listing: this._id });
    next();
  } catch (error) {
    console.log(error.message, "failed ro delete dependent data");
  }
});

const listingsModel = mongoose.model("listings", listingsSchema);

// await listingsModel.ensureIndexes();

export { listingsModel };
// .ensureIndexes();
