import express from "express";
import {
  addProfilePhoto,
  getMyProfile,
  getUserByID,
  login,
  logout,
  register,
  verifyUser,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/verify").post(isAuthenticated, verifyUser);

router
  .route("/register/photo")
  .post(isAuthenticated, upload.single("avatar"), addProfilePhoto);

router.route("/login").post(login);

router.route("/profile").get(isAuthenticated, getMyProfile).post(getUserByID);

router.route("/logout").get(logout);

export default router;
