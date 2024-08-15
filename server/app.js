import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cron from "node-cron";
import user from "./routers/user.js";
import listings from "./routers/listings.js";
import category from "./routers/category.js";
import comments from "./routers/comments.js";
import chatModule from "./routers/chatModule.js";
import location from "./routers/location.js";
import payment from "./routers/payment.js";
import { listingsModel } from "./models/listings.js";

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/v1", user);
app.use("/api/v1", listings);
app.use("/api/v1", category);
app.use("/api/v1", comments);
app.use("/api/v1", chatModule);
app.use("/api/v1", location);
app.use("/api/v1", payment);

app.get("/", (req, res) => {
  res.send("Hello World! Madhyayuga Here");
});

cron.schedule("0 0 * * *", async () => {
  try {
    // Update credit and premium for expired listings
    const expiredListings = await listingsModel.find({
      creditExpiry: { $lt: new Date() },
    });

    for (const listing of expiredListings) {
      listing.credit = 0;
      listing.premium = false;
      await listing.save();
    }
    console.log("Expired listings updated successfully.");
  } catch (error) {
    console.error("Error updating expired listings:", error);
  }
});
