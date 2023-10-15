import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  addListing,
  deleteListing,
  getListings,
  getMyListings,
  updateListing,
} from "../controllers/listings.js";
import { upload } from "../config/cloudinary.js";
import { collectFormData } from "../middleware/test.js";

const router = express.Router();

router.route("/listings").get(getListings);

router.route("/listings/my").get(isAuthenticated, getMyListings);

router
  .route("/listings/add")
  .post(isAuthenticated, upload.single("avatar"), addListing);

router
  .route("/listings/update/:listingId")
  .put(isAuthenticated, collectFormData, updateListing)
  .delete(isAuthenticated, deleteListing);

export default router;
