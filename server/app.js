import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import user from "./routers/user.js";
import listings from "./routers/listings.js";
import category from "./routers/category.js";

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/api/v1", user);
app.use("/api/v1", listings);
app.use("/api/v1", category);
