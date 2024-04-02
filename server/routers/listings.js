import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import {
  addListing,
  deleteListing,
  getListings,
  getMyListings,
  updateListing,
  updateListingViews,
} from "../controllers/listings.js";
import { upload } from "../config/cloudinary.js";
import { collectFormData } from "../middleware/test.js";
import { addBid, deleteBid, getBids } from "../controllers/bid.js";
import {
  addReport,
  deleteReport,
  getReports,
  updateReport,
} from "../controllers/report.js";
import {
  addFavourite,
  getFavourites,
  isFavourite,
  removeFavourite,
} from "../controllers/favourites.js";

const router = express.Router();

router.route("/listings").get(getListings);

router.route("/listings/my").get(isAuthenticated, getMyListings);

router
  .route("/listings/add")
  .post(isAuthenticated, upload.single("avatar"), addListing);

router
  .route("/listings/update/:listingId")
  .put(isAuthenticated, updateListing)
  .delete(isAuthenticated, deleteListing);

router.route("/listings/update/views/:listingId").patch(updateListingViews);

router.route("/listings/:listingId/bids").get(getBids);

router.route("/listings/:listingId/bids/add").post(isAuthenticated, addBid);

router
  .route("/listings/:listingId/bids/update/:bidId")
  .delete(isAuthenticated, deleteBid);

router
  .route("/listings/:listingId/favourites/add")
  .post(isAuthenticated, addFavourite);

router
  .route("/listings/:listingId/favourites")
  .delete(isAuthenticated, removeFavourite);

router.route("/listings/favourites/my").get(isAuthenticated, getFavourites);

router
  .route("/listings/:listingId/favourites/check")
  .get(isAuthenticated, isFavourite);

router
  .route("/listings/reports/add")
  .post(isAuthenticated, upload.single("image"), addReport);

router.route("/listings/reports/").get(isAuthenticated, isAdmin, getReports);

router
  .route("/listings/reports/update/:id")
  .put(isAuthenticated, updateReport)
  .delete(isAuthenticated, deleteReport);

export default router;
