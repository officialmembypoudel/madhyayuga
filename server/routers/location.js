import express from "express";
import {
  addLocation,
  deleteLocation,
  getLocations,
  updateLocation,
} from "../controllers/location.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/locations").get(getLocations);
router.route("/locations/add").post(isAuthenticated, isAdmin, addLocation);
router
  .route("/locations/update/:locationId")
  .put(isAuthenticated, isAdmin, updateLocation)
  .delete(isAuthenticated, isAdmin, deleteLocation);

export default router;
