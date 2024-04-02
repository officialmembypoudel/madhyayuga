import { favouritesModel } from "../models/favourites.js";

export const addFavourite = async (req, res) => {
  try {
    if (!req.params.listingId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide listing!" });
    }
    const ifExist = await favouritesModel.findOne({
      listing: req.params.listingId,
      user: req.user._id,
    });
    if (ifExist) {
      return res
        .status(400)
        .json({ success: false, message: "Its already your favourite!" });
    }
    const favourite = await favouritesModel.create({
      listing: req.params.listingId,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Favourite added successfully!",
      document: favourite,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const favourites = await favouritesModel
      .find({ user: req.user._id })
      .populate({
        path: "listing",
        populate: { path: "userId", model: "user" },
      });
    res.status(200).json({
      success: true,
      documents: favourites,
      message: "Favourites fetched successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavourite = async (req, res) => {
  try {
    if (!req.params.listingId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide listing id!" });
    }
    const favourite = await favouritesModel.findOne({
      listing: req.params.listingId,
      user: req.user._id,
    });
    if (!favourite) {
      return res
        .status(404)
        .json({ success: false, message: "Favourite not found!" });
    }
    await favouritesModel.findByIdAndDelete(favourite._id);
    res
      .status(200)
      .json({ success: true, message: "Favourite removed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const isFavourite = async (req, res) => {
  try {
    if (!req.params.listingId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide listing id!" });
    }
    const favourite = await favouritesModel.findOne({
      listing: req.params.listingId,
      user: req.user._id,
    });
    if (!favourite) {
      return res
        .status(404)
        .json({ success: false, message: "Favourite not found!" });
    }
    res.status(200).json({
      success: true,
      document: favourite,
      message: "Favourite fetched successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
