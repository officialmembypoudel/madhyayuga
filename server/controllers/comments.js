import { commentModel } from "../models/comments.js";

// add comments
export const addComment = async (req, res) => {
  // Implementation for adding comments
  try {
    const { listingId, type, text, commentId } = req.body;

    if (!listingId || !type || !text) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to add comment!",
      });
    }

    if (type === "comment") {
      let comment = await commentModel.create({
        text,
        listingId,
        user: req.user._id,
      });
      return res.status(200).json({
        success: true,
        message: "Comment added successfully",
        documents: comment,
      });
    }
    if (type === "reply") {
      let comment = await commentModel.findById(commentId);

      if (!comment) {
        return res.status(400).json({
          success: false,
          message: "Comment does not exist!",
        });
      }

      comment.replies.push({
        text,
        user: req.user._id,
      });
      comment.save();
      return res.status(200).json({
        success: true,
        message: "Reply added successfully",
        documents: comment,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all comments
export const getAllComments = async (req, res) => {
  // Implementation for getting all comments
  try {
    const { listingId } = req.params;
    const comments = await commentModel
      .find({ listingId })
      .populate("user")
      .populate("replies.user")
      .sort({ createdAt: -1 });
    const total = await commentModel.countDocuments({ listingId });

    res.status(200).json({
      success: true,
      message: "Fetched comments successfully!",
      documents: comments,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single comment by ID
export const getCommentById = async (req, res) => {
  // Implementation for getting a comment by ID
  try {
    const { commentId } = req.params;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment doesn't exist!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Fetched comment successfully!",
      documents: comment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing comment
// export const updateComment = (req, res) => {
//   // Implementation for updating an existing comment
//   try {
//     const { commentId } = req.params;
//     const { type,text } = req.body;

//     if (!commentId || !type || !text) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required to update comment!",
//       });
//     }

//     if(type==="comment"){
//         let comment = commentModel.findByIdAndUpdate(commentId, {
//             text,
//         });
//         return res.status(200).json({
//             success: true,
//             message: "Comment updated successfully",
//             documents: comment,
//         });
//     }

//     if(type==="reply"){
//         let comment = commentModel.findById(commentId);
//         if (!comment) {
//             return res.status(400).json({
//               success: false,
//               message: "Comment doesn't exist!",
//             });
//         }
//         comment.replies.push({
//             text,
//             user: req.user._id,
//         });
//     }

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }

// };

// Delete a comment
export const deleteComment = async (req, res) => {
  // Implementation for deleting a comment
  try {
    const { commentId, replyId } = req.params;
    const { type } = req.body;

    const comment = await commentModel.findById(commentId);

    if (!commentId || !type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to delete comment!",
      });
    }

    if (!comment) {
      return res
        .status(400)
        .json({ success: false, message: "Comment not found!" });
    }
    if (type === "comment") {
      await commentModel.findByIdAndDelete({ commentId });
      return res.json({
        success: true,
        message: "Comment deleted successfully!",
      });
    }

    const replyIndex = comment.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );
    if (replyIndex === -1) {
      return res.status(404).json({ message: "Reply not found" });
    }
    comment.replies.splice(replyIndex, 1);

    comment.save();

    return res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
