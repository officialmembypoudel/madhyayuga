import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import user from "./routers/user.js";
import listings from "./routers/listings.js";
import category from "./routers/category.js";
import comments from "./routers/comments.js";
import chatModule from "./routers/chatModule.js";
import location from "./routers/location.js";

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use("/api/v1", user);
app.use("/api/v1", listings);
app.use("/api/v1", category);
app.use("/api/v1", comments);
app.use("/api/v1", chatModule);
app.use("/api/v1", location);
