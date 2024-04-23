import multer from "multer";
import { listingsModel } from "../models/listings.js";
import { sendMail } from "../utils/sendMail.js";
import { userModel } from "../models/user.js";
import mongoose from "mongoose";

export const addListing = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.condition ||
      !req.body.with ||
      !req.body.location ||
      !req.body.categoryId ||
      !req.files
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details!" });
    }
    const images = req.files;

    if (!images) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image!",
      });
    }
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
    listing.images = images.map((image) => {
      return {
        public_id: image.filename,
        url: image.path,
      };
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
    const { userId } = req.query;
    console.log(userId);

    if (userId) {
      const listings = await listingsModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .populate("userId", "name email avatar phone rating totalRating");
      const total = await listingsModel.countDocuments({ userId });

      return res.status(200).json({
        success: true,
        message: "Fetched Listings successfully!",
        documents: listings,
        total,
      });
    }
    let listings;
    if (req?.user?.isAdmin) {
      listings = await listingsModel
        .find({})
        .sort({ createdAt: -1 })
        .populate("userId", "name email avatar phone rating totalRating");
    } else {
      listings = await listingsModel
        .find({ rejected: false })
        .sort({ credit: -1, createdAt: -1 })
        .populate("userId", "name email avatar phone rating totalRating");
    }
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
      .populate("userId", "name email avatar phone rating totalRating");

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

    let images = req.files;
    const listing = await listingsModel.findByIdAndUpdate(listingId, req.body, {
      new: true,
    });

    if (images) {
      images = images.map((image) => {
        return {
          public_id: image.filename,
          url: image.path,
        };
      });
      listing.images = images;
      listing.save();
    }
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
    const { query, city } = req.query;
    let listings;
    if ((city === "Nepal" || !city) && query) {
      listings = await listingsModel
        .find({
          $text: { $search: query, $caseSensitive: false },
        })
        .populate("userId", "name email avatar phone rating totalRating");
    } else if (!query && city) {
      listings = await listingsModel
        .find({
          location: city,
        })
        .populate("userId", "name email avatar phone rating totalRating");
    } else {
      listings = await listingsModel
        .find({
          $text: { $search: query, $caseSensitive: false },
          location: city,
        })
        .populate("userId", "name email avatar phone rating totalRating");
    }

    res.status(200).json({
      success: true,
      message: "Fetched Listings successfully!",
      documents: listings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListingsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log(categoryId);
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a category id!",
      });
    }

    const listings = await listingsModel
      .find({ categoryId: new mongoose.Types.ObjectId(categoryId) })
      .populate("userId", "name email avatar phone rating totalRating");
    if (listings.length === 0 || !listings) {
      return res.status(200).json({
        success: true,
        message: "No listings found!",
        documents: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched Listings by category successfully!",
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

export const addCredit = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { credit, days } = req.body;
    const user = req.user;

    if (!credit || !days) {
      return res.status(400).json({
        success: false,
        message: "Please provide credit and days!",
      });
    }

    if (credit < 0) {
      return res.status(400).json({
        success: false,
        message: "Credit must be greater than 0!",
      });
    }

    if (user.credit < credit) {
      return res.status(400).json({
        success: false,
        message: "You don't have enough credit to add to this listing",
      });
    }

    let listing = await listingsModel.findById(listingId);

    if (!listing) {
      return res.status(400).json({
        success: false,
        message: "Listing doesn't exist!",
      });
    }

    if (listing.creditExpiry > new Date(Date.now())) {
      return res.status(400).json({
        success: false,
        message: "You can't add credit to a listing with active credit!",
      });
    }

    const updatedListing = await listingsModel.findByIdAndUpdate(
      listingId,
      {
        credit: listing.credit + credit,
        creditExpiry: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );
    await userModel.findByIdAndUpdate(user._id, {
      credit: user.credit - credit,
    });

    return res.status(200).json({
      success: true,
      message: "Credit added successfully",
      document: updatedListing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryListingCount = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a category id!",
      });
    }

    const total = await listingsModel.countDocuments({
      categoryId: new mongoose.Types.ObjectId(categoryId),
    });

    return res.status(200).json({
      success: true,
      message: "Fetched Listings by category successfully!",
      total,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLocationListingCount = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "Please provide a city!",
      });
    }

    console.log(city, "city ki ma kim bharosha");
    const total = await listingsModel.countDocuments({ location: city });

    return res.status(200).json({
      success: true,
      message: "Fetched Listings by location count successfully!",
      total,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
