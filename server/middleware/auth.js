import jwt from "jsonwebtoken";
import { userModel } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let { token } = req.cookies;

    if (!token) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "You are not Logged in!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded._id);

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (!req?.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this route",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
``;
