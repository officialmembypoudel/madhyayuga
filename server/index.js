import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";
import { configureCloudinary } from "./config/cloudinary.js";

config({
  path: "./config/config.env",
});

configureCloudinary();
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log("server is running on port " + process.env.PORT);
});
