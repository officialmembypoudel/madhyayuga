import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.js";

const router = express.Router();

router.route("/categories").get(getCategories);

router.route("/categories/add").post(isAuthenticated, isAdmin, addCategory);

router
  .route("/categories/update/:categoryId")
  .put(isAuthenticated, isAdmin, updateCategory)
  .delete(isAuthenticated, isAdmin, deleteCategory);

export default router;
