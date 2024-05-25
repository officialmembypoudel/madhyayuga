import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createPaymentIntent } from "../controllers/stripe.js";

const router = express.Router();

router
  .route("/create-payment-intent")
  .post(isAuthenticated, createPaymentIntent);

export default router;


