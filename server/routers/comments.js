import express from "express";
import {
  addComment,
  deleteComment,
  getAllComments,
} from "../controllers/comments.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/listings/:listingId/comments").get(getAllComments);

router.route("/listings/comments/add").post(isAuthenticated, addComment);

router
  .route("/listings/comments/delete/:commentId")
  .post(isAuthenticated, deleteComment);

export default router;
