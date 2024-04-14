import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },

  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  otp: Number,
  opt_expiry: Date,
  verified: {
    type: Boolean,
    default: false,
  },
  forget_password_otp: Number,
  forget_password_otp_expiry: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  credit: {
    type: Number,
    default: 0,
  },
  suspended: {
    type: Boolean,
    default: false,
  },
  searchText: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async function (next) {
  this.searchText = this.name + " " + this.email + " " + this.phone;
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(15);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.index(
  {
    "$**": "text",
  },
  { name: "text_index" }
);

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000,
  });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const userModel = mongoose.model("user", userSchema);
