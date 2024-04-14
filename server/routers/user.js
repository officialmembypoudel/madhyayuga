import express from "express";
import {
    addProfilePhoto,
    deleteUser,
    editUser, fetchToReview,
    getMyProfile,
    getUserByID,
    getUsers,
    login,
    logout,
    register, reviewUser,
    suspendUnsuspendUser,
    verifyUser,
} from "../controllers/user.js";
import {isAdmin, isAuthenticated} from "../middleware/auth.js";
import {upload} from "../config/cloudinary.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/verify").post(isAuthenticated, verifyUser);

router
    .route("/register/photo")
    .post(isAuthenticated, upload.single("avatar"), addProfilePhoto);

router.route("/login").post(login);

router.route("/profile").get(isAuthenticated, getMyProfile).post(getUserByID);

router.route("/logout").get(logout);

router.route("/users").get(isAuthenticated, isAdmin, getUsers);

router
    .route("/users/update/:userId")
    .put(isAuthenticated, editUser)
    .patch(isAuthenticated, isAdmin, suspendUnsuspendUser)
    .delete(isAuthenticated, isAdmin, deleteUser);

router.route("/users/review").get(isAuthenticated, fetchToReview).post(isAuthenticated, reviewUser)

export default router;
