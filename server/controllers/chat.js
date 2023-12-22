import { chatModel } from "../models/chat.js";
import { messageModel } from "../models/messages.js";
import { userModel } from "../models/user.js";

export const createChatRoom = async (req, res) => {
  try {
    const { user1 } = req.body;
    const user2 = req.user._id.toString();
    const listingId = req.params.listingId;

    if (!user1 || !user2 || !listingId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to add chat!",
      });
    }

    let chat = await chatModel.findOne({
      members: { $all: [user1, user2] },
      listing: listingId,
    });

    if (chat) {
      const user1 = await userModel.findById(chat.members[0]);
      const user2 = await userModel.findById(chat.members[1]);

      chat.members[0] = {
        name: user1.name,
        email: user1.email,
        _id: user1._id,
        avatar: user1.avatar.url,
        phone: user1.phone,
      };
      chat.members[1] = {
        name: user2.name,
        email: user2.email,
        _id: user2._id,
        avatar: user2.avatar.url,
        phone: user2.phone,
      };

      return res.status(200).json({
        success: false,
        message: "Chat already exists!",
        documents: chat,
      });
    }
    chat = await chatModel.create({
      members: [user1, user2],
      listing: listingId,
    });
    const userA = await userModel.findById(chat.members[0]);
    const userB = await userModel.findById(chat.members[1]);

    chat.members[0] = {
      name: userA.name,
      email: userA.email,
      _id: userA._id,
      avatar: userA.avatar.url,
      phone: userA.phone,
    };
    chat.members[1] = {
      name: userB.name,
      email: userB.email,
      _id: userB._id,
      avatar: userB.avatar.url,
      phone: userB.phone,
    };

    res.status(200).json({
      success: true,
      message: "Chat added successfully",
      documents: chat,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const findChatRoom = async (req, res) => {
  try {
    const user = req.user._id.toString();

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to find chat!",
      });
    }

    let chat = await chatModel
      .find({
        members: { $in: [user] },
      })
      .populate("listing");

    if (!chat.length) {
      return res.status(200).json({
        success: false,
        message: "Chats not found!",
      });
    }

    let lastMessages = await messageModel
      .find({ chatId: chat[0]._id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastMessages.length) {
      lastMessages = {
        message: "No messages",
        createdAt: Date.now(),
      };
    }

    for (let i = 0; i < chat.length; i++) {
      const user1 = await userModel.findById(chat[i].members[0]);
      const user2 = await userModel.findById(chat[i].members[1]);
      chat[i].members[0] = {
        name: user1.name,
        email: user1.email,
        _id: user1._id,
        avatar: user1.avatar.url,
        phone: user1.phone,
      };
      chat[i].members[1] = {
        name: user2.name,
        email: user2.email,
        _id: user2._id,
        avatar: user2.avatar.url,
        phone: user2.phone,
      };
    }
    chat = chat.map((c) => {
      return {
        ...c._doc,
        lastMessage: lastMessages[0]?.message,
        lastMessageTime: lastMessages[0]?.createdAt,
      };
    });
    return res.status(200).json({
      success: true,
      message: "Chats found successfully!",
      documents: chat,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const findChat = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    if (!user1 || !user2) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to find chat!",
      });
    }

    const chat = await chatModel.find({
      members: { $all: [user1, user2] },
    });

    if (!chat.length) {
      return res.status(400).json({
        success: false,
        message: "Chat not found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Chat found successfully!",
      documents: chat,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
