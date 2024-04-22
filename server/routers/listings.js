import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import {
  addCredit,
  addListing,
  deleteListing,
  getCategoryListingCount,
  getListings,
  getListingsByCategory,
  getLocationListingCount,
  getMyListings,
  rejectUnrejectListing,
  searchListings,
  updateListing,
  updateListingViews,
} from "../controllers/listings.js";
import { upload } from "../config/cloudinary.js";
import { collectFormData } from "../middleware/test.js";
import { addBid, deleteBid, getBids } from "../controllers/bid.js";
import {
  addReport,
  deleteReport,
  getReportMessages,
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
router.route("/listings/search").get(searchListings);
router.route("/listings/search/:categoryId").get(getListingsByCategory);
router
  .route("/listings/:categoryId/count")
  .get(isAuthenticated, getCategoryListingCount);
router
  .route("/listings/location/:city/count")
  .get(isAuthenticated, getLocationListingCount);

router.route("/listings/my").get(isAuthenticated, getMyListings);

router
  .route("/listings/add")
  .post(isAuthenticated, upload.array("images"), addListing);

router
  .route("/listings/update/:listingId")
  .put(isAuthenticated, upload.array("images"), updateListing)
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
  .put(isAuthenticated, isAdmin, updateReport)
  .delete(isAuthenticated, isAdmin, deleteReport);

router
  .route("/listings/reports/:id/messages")
  .get(isAuthenticated, isAdmin, getReportMessages);

router
  .route("/listings/:listingId/reject")
  .post(isAuthenticated, isAdmin, rejectUnrejectListing);
router
  .route("/listings/:listingId/add-credit")
  .patch(isAuthenticated, addCredit);

export default router;
