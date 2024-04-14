import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
            required: true,
        },
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "listings",
        },
        dealInitiated: {
            type: Boolean,
            default: false,
        },
        dealAccepted: {
            type: Boolean,
            default: false,
        },
       
        dealInitiator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",

        }
    },
    {
        timestamps: true,
    }
);

export const chatModel = mongoose.model("chats", chatSchema);
