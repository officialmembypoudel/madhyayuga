import { categoryModel } from "../models/category.js";
import { listingsModel } from "../models/listings.js";
import mongoose from "mongoose";

export const addCategory = async (req, res) => {
  try {
    const { name, icon, iconFamily } = req.body;

    if (!name || !icon || !iconFamily) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to add category!",
      });
    }

    let category = await categoryModel.findOne({ name });

    if (category) {
      return res.status(400).json({
        success: false,
        message: "Category already exists!",
      });
    }
    category = await categoryModel.create(req.body);

    const categoryData = {
      _id: category._id,
      name: category.name,
      icon: category.icon,
      iconFamily: category.iconFamily,
      color: category.color,
      createdAt: category.createdAt,
    };

    res.status(200).json({
      success: true,
      message: "Category added successfully",
      documents: categoryData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    const total = await categoryModel.countDocuments({});

    res.status(200).json({
      success: true,
      message: "Fetched Listings successfully!",
      documents: categories,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      categoryId,
      req.body,
      {
        new: true,
      }
    );

    res.status(201).json({
      success: true,
      message: "Updated category successfully",
      document: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    let category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category doesn't exist!",
      });
    }

    let count = await listingsModel.countDocuments({
      categoryId: new mongoose.Types.ObjectId(categoryId),
    });

    if (count > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete listing because it has one or more listing please delete it first!",
      });
    }

    await categoryModel.findByIdAndDelete(categoryId);
    res.status(200).json({
      success: true,
      message: "Deleted category successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
