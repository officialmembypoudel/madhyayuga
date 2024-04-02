import { bidModel } from "../models/bid.js";

export const addBid = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { forId } = req.body;

    if (!listingId || !forId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to add bid!",
      });
    }

    if (listingId === forId) {
      return res.status(400).json({
        success: false,
        message: "You cannot bid for your own listing!",
      });
    }

    const ifBidExists = await bidModel.findOne({
      listing: listingId,
      for: forId,
    });
    if (ifBidExists) {
      return res.status(400).json({
        success: false,
        message: "You have already bid for this listing!",
      });
    }

    const bid = await bidModel.create({
      listing: listingId,
      for: forId,
    });

    return res.status(201).json({
      success: true,
      message: "Bid added successfully",
      documents: bid,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBids = async (req, res) => {
  try {
    const { listingId } = req.params;
    console.log(listingId);
    const bids = await bidModel
      .find({ listing: listingId })
      .populate({
        path: "for",
        populate: { path: "userId", model: "user" },
      })
      .populate({
        path: "listing",
        populate: { path: "userId", model: "user" },
      });
    console.log(bids);
    return res.status(200).json({
      success: true,
      message: "Bids fetched successfully",
      documents: bids,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBid = async (req, res) => {
  try {
    const { bidId } = req.params;

    if (!bidId) {
      return res.status(400).json({
        success: false,
        message: "Bid ID is required to delete bid!",
      });
    }

    const requestedBid = await bidModel
      .findById(bidId)
      .populate("for")
      .populate("listing");

    if (requestedBid.listing.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this bid!",
      });
    }

    const bid = await bidModel.findByIdAndDelete(bidId);
    return res.status(200).json({
      success: true,
      message: "Bid deleted successfully",
      documents: bid,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
