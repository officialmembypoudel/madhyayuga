import { upload } from "../config/cloudinary.js";
import { userModel } from "../models/user.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import fs from "fs";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // const avatar = req.file;

    let user = await userModel.findOne({ email: email.toLowerCase() });

    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already in use!" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user = await userModel.create({
      name: name,
      email: email.toLowerCase(),
      password: password,
      phone: Number(phone),
      otp,
      opt_expiry: new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 1000),
    });
    await sendMail(user.email, "Verify your account", `Your OTP is ${otp}`);
    sendToken(
      res,
      user,
      201,
      "OTP sent to your email please verify your account"
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const otp = Number(req.body.otp);

    const user = await userModel.findById(req.user._id);

    if (user.otp !== otp || user.opt_expiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    user.verified = true;
    user.otp = null;
    user.opt_expiry = null;

    await user.save();

    sendToken(res, user, 200, "Your account has been verified.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addProfilePhoto = async (req, res) => {
  try {
    const avatar = req.file;

    let user = await userModel.findById(req.user._id);

    user.avatar = {
      public_id: avatar.filename,
      url: avatar.path,
    };

    user.save();

    sendToken(res, user, 201, "Your profile photo has been updated.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    let user = await userModel
      .findOne({ email: email.toLowerCase() })
      .select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    sendToken(res, user, 200, "You have been logged in.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    sendToken(res, user, 201, `Welcome back ${user.name}`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ success: true, message: "You have been logged out." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserByID = async (req, res) => {
  try {
    const { userId } = req.body;

    let user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Doesn't exist!" });
    }
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    };

    res.status(200).json({
      success: true,
      message: "Got user successfully!",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    if (!users)
      return res
        .status(400)
        .json({ success: false, message: "No users found!" });

    res.status(200).json({ success: true, documents: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
