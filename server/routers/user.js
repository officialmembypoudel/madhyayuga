import express from "express";
import {
  addCredit,
  addProfilePhoto,
  addPushToken,
  deleteUser,
  editUser,
  fetchMyReviews,
  fetchToReview,
  fetchUserReviews,
  getMyProfile,
  getNotifications,
  getUserByID,
  getUsers,
  login,
  logout,
  register,
  resendOTP,
  reviewUser,
  sendNotification,
  suspendUnsuspendUser,
  updateUser,
  verifyUser,
} from "../controllers/user.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.route("/register").post(register);

router
  .route("/verify")
  .get(isAuthenticated, resendOTP)
  .post(isAuthenticated, verifyUser);

router
  .route("/register/photo")
  .post(isAuthenticated, upload.single("avatar"), addProfilePhoto);

router.route("/login").post(login);

router.route("/profile").get(isAuthenticated, getMyProfile).post(getUserByID);

router.route("/logout").get(logout);

router.route("/update/me").put(isAuthenticated, updateUser);

router.route("/users").get(isAuthenticated, isAdmin, getUsers);

router
  .route("/users/update/:userId")
  .put(isAuthenticated, editUser)
  .patch(isAuthenticated, isAdmin, suspendUnsuspendUser)
  .delete(isAuthenticated, isAdmin, deleteUser);

router
  .route("/users/review")
  .get(isAuthenticated, fetchToReview)
  .patch(isAuthenticated, reviewUser);

router.route("/users/add-credit").patch(isAuthenticated, addCredit);

router.route("/users/:userId").get(isAuthenticated, isAdmin, getUserByID);

router.route("/users/:userId/reviews").get(fetchUserReviews);

router.route("users/me/reviews").get(isAuthenticated, fetchMyReviews);

router.route("/users/me/add-push-token").patch(isAuthenticated, addPushToken);

router.route("/users/notify").post(isAuthenticated, isAdmin, sendNotification);
router.route("/users/notifications/get").get(isAuthenticated, getNotifications);

export default router;
