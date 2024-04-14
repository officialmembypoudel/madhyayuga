import multer from "multer";
import { listingsModel } from "../models/listings.js";
import { sendMail } from "../utils/sendMail.js";

export const addListing = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.condition ||
      !req.body.with ||
      !req.body.location ||
      !req.body.categoryId ||
      !req.file
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details!" });
    }
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
    const listings = await listingsModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("userId", "name email avatar phone");
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
      .sort({ createdAt: -1 })
      .populate("userId", "name email avatar phone");

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
    const listing = await listingsModel.findByIdAndUpdate(listingId, req.body, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: "Updated listing successfully",
      documents: listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateListingViews = async (req, res) => {
  // TODO add more logic for file upload
  try {
    const { listingId } = req.params;
    const listing = await listingsModel.findByIdAndUpdate(
      listingId,
      { $inc: { views: 1 } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Updated listing successfully",
      documents: listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  console.log("delete listing");
  try {
    const { listingId } = req.params;
    const { message } = req.body;

    let listing = await listingsModel
      .findById(listingId)
      .populate("userId", "email");

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: "Listing doesn't exist!",
      });
    }
    if (req?.user?.isAdmin) {
      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Please provide a reason for deleting this listing!",
        });
      }
      console.log("it hit here, delete listing");
      await listingsModel.findByIdAndDelete(listingId);
      sendMail(
        listing?.userId?.email,
        "Listing Deleted",
        `Your listing ${listing.name} has been deleted for the following reason: ${message}`
      );
      return res.status(200).json({
        success: true,
        message: "Deleted listing successfully",
      });
    }
    if (listing.userId.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this listing!",
      });
    }

    await listingsModel.findByIdAndDelete(listingId);
    return res.status(200).json({
      success: true,
      message: "Deleted listing successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchListings = async (req, res) => {
  try {
    const { query } = req.query;

    const listings = await listingsModel
      .find({
        $text: { $search: query },
      })
      .populate("userId", "name email avatar phone")
      .populate("categoryId");

    res.status(200).json({
      success: true,
      message: "Fetched Listings successfully!",
      documents: listings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectUnrejectListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { message } = req.body;

    let listing = await listingsModel
      .findById(listingId)
      .populate("userId", "email");
    console.log(listing);

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: "Listing doesn't exist!",
      });
    }

    if (listing.rejected) {
      await listingsModel.findByIdAndUpdate(listingId, { rejected: false });

      sendMail(
        listing?.userId?.email,
        "Listing Approved",
        `Your listing ${listing.name} has been approved!`
      );

      return res.status(200).json({
        success: true,
        message: `Your Listing of name ${listing.name} has been approved!`,
        document: listing,
      });
    }

    await listingsModel.findByIdAndUpdate(listingId, { rejected: true });

    sendMail(
      listing?.userId?.email,
      "Listing Rejected",
      `Your listing ${listing.name} has been rejected for the following reason: ${message}`
    );

    return res.status(200).json({
      success: true,
      message: "Rejected listing successfully",
      document: listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error.message);
  }
};
