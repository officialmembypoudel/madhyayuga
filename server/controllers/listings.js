import multer from "multer";
import { listingsModel } from "../models/listings.js";

export const addListing = async (req, res) => {
  try {
    const avatar = req.file;
    let listing = await listingsModel.create({
      name: req.body.name,
      userId: req.user._id,
      description: req.body.description,
      condition: req.body.condition,
      views: 0,
      with: req.body.with,
      location: req.body.location,
      categoryId: req.body.categoryId,
    });
    listing.images.push({
      public_id: avatar.filename,
      url: avatar.path,
    });
    listing.save();
    const listingData = {
      _id: listing._id,
      name: listing.name,
      userId: listing.userId,
      description: listing.description,
      condition: listing.condition,
      views: listing.views,
      updatedAt: listing.updatedAt,
      createdAt: listing.createdAt,
      with: listing.with,
      premium: listing.premium,
      images: listing.images,
      location: listing.location,
    };
    res.status(200).json({
      success: true,
      message: "Listing created successfully!",
      documents: listingData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const listings = await listingsModel.find({}).sort({ createdAt: -1 });
    const total = await listingsModel.countDocuments({});

    res.status(200).json({
      success: true,
      message: "Fetched Listings successfully!",
      documents: listings,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const listing = await listingsModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!listing) {
      res
        .status(200)
        .json({ success: true, message: "You don't have any listings!" });
    }

    res.status(200).json({
      success: true,
      message: "Fetched listings successfully",
      documents: listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateListing = async (req, res) => {
  // TODO add more logic for file upload
  try {
    const { listingId } = req.params;
    // console.log(req.body);
    const parser = multer({ dest: "/uploads" });
    parser.single("image");
    // console.log(req.file);
    // const listing = await listingsModel.findByIdAndUpdate(listingId, req.body, {
    //   new: true,
    // });

    // res.status(201).json({
    //   success: true,
    //   message: "Updated listing successfully",
    //   documents: listing,
    // });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  // TODO Add image delete logic
  try {
    const { listingId } = req.params;
    let listing = await listingsModel.findById(listingId);

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: "Listing doesn't exist!",
      });
    }

    if (listing.userId !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this listing!",
      });
    }

    await listingsModel.findByIdAndDelete(listingId);
    res.status(200).json({
      success: true,
      message: "Deleted listing successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
