import express from "express";
import {
  addLocation,
  deleteLocation,
  getLocations,
  updateLocation,
} from "../controllers/location.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/locations").get(getLocations);
router.route("/locations/add").post(isAuthenticated, addLocation);
router
  .route("/locations/update/:locationId")
  .put(isAuthenticated, updateLocation)
  .delete(isAuthenticated, deleteLocation);

export default router;
