import express from "express";
import {acceptDeal, createChatRoom, findChat, findChatRoom, listingDealer} from "../controllers/chat.js";
import {createMessage, getMessages} from "../controllers/messages.js";
import {isAuthenticated} from "../middleware/auth.js";

const router = express.Router();

router
    .route("/listings/:listingId/chats/create-room")
    .post(isAuthenticated, createChatRoom);

router.route("/chats").get(isAuthenticated, findChatRoom);

router.route("/chats/find/:user1/:user2").get(isAuthenticated, findChat);

router.route("/chats/messages/add").post(isAuthenticated, createMessage);

router.route("/chats/messages/:chatId").get(isAuthenticated, getMessages).patch(isAuthenticated, listingDealer).put(isAuthenticated, acceptDeal);

export default router;
