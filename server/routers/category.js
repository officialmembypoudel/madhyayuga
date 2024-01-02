import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.js";

const router = express.Router();

router.route("/categories").get(isAuthenticated, getCategories);

router.route("/categories/add").post(isAuthenticated, addCategory);

router
  .route("/categories/update/:categoryId")
  .put(isAuthenticated, updateCategory)
  .delete(isAuthenticated, deleteCategory);

export default router;
