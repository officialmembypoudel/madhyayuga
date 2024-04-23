import { locationModel } from "../models/location.js";
import { capitalizeFirstLetter } from "../utils/helperFunctions.js";

export const addLocation = async (req, res) => {
  try {
    if (!req.body.city || !req.body.latitude || !req.body.longitude) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details!" });
    }
    const ifExist = await locationModel.findOne({
      city: capitalizeFirstLetter(req.body.city),
    });
    if (ifExist) {
      return res
        .status(400)
        .json({ success: false, message: "Location already exists!" });
    }

    req.body.latitude = parseFloat(req.body.latitude);
    req.body.longitude = parseFloat(req.body.longitude);
    req.body.city = capitalizeFirstLetter(req.body.city);
    const location = await locationModel.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLocations = async (req, res) => {
  try {
    const locations = await locationModel
      .find({ city: { $ne: "Nepal" } })
      .sort({ city: 1 });
    res.status(200).json({
      success: true,
      documents: locations,
      message: "Location fetched successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    if (!req.params.locationId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide location id!" });
    }
    if (req.body.city === "Nepal") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot update Nepal!" });
    }
    const location = await locationModel.findById(req.params.locationId);
    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found!" });
    }
    const updatedLocation = await locationModel.findByIdAndUpdate(
      req.params.locationId,
      { ...req.body, city: capitalizeFirstLetter(req.body.city) },

      {
        new: true,
      }
    );
    res.status(200).json({ success: true, document: updatedLocation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    if (!req.params.locationId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide location id!" });
    }
    if (req.body.city === "Nepal") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete Nepal!" });
    }
    const location = await locationModel.findById(req.params.locationId);
    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }
    await locationModel.findByIdAndDelete(req.params.locationId);
    res
      .status(200)
      .json({ success: true, message: "Location deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
