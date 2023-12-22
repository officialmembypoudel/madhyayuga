import { messageModel } from "../models/messages.js";

export const createMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const sender = req.user._id.toString();
    if (!chatId || !sender || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to add message!",
      });
    }

    const newMessage = await messageModel.create({
      chatId: chatId,
      sender: sender,
      message: message,
    });

    res.status(200).json({
      success: true,
      message: "Message added successfully",
      document: newMessage,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to get messages!",
      });
    }

    const messages = await messageModel.find({ chatId });

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully!",
      documents: messages,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
