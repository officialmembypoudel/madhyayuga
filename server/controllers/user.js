import { upload } from "../config/cloudinary.js";
import reviewsModel from "../models/reviews.js";
import { userModel } from "../models/user.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import { toReviewModel } from "../models/toReview.js";
import { purchaseModel } from "../models/purchase.js";
import { notificationModel } from "../models/notification.js";
import { Expo } from "expo-server-sdk";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // const avatar = req.file;

    let user = await userModel.findOne({ email: email.toLowerCase() });

    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already in use!" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user = await userModel.create({
      name: name,
      email: email.toLowerCase(),
      password: password,
      phone: Number(phone),
      otp,
      opt_expiry: new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 1000),
    });
    await sendMail(
      user.email,
      "Verify your account",
      `Your OTP is ${otp}
    
    
    Team Madhyayuga
    madhyayuga@gmail.com`
    );
    sendToken(
      res,
      user,
      201,
      "OTP sent to your email please verify your account"
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user.otp = otp;
    user.opt_expiry = new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 1000);
    await user.save();
    await sendMail(
      user.email,
      "Verify your account",
      `Your new OTP is ${otp}
    
    
    Team Madhyayuga
    madhyayuga@gmail.com`
    );
    sendToken(
      res,
      user,
      201,
      "OTP sent to your email please verify your account"
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const otp = Number(req.body.otp);

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (req?.user?.isAdmin) {
      if (user.verified) {
        user.verified = false;
        user.otp = null;
        user.opt_expiry = null;
        await user.save();
        return res
          .status(200)
          .json({ success: true, message: "User unverified successfully" });
      } else {
        user.verified = true;
        user.otp = null;
        user.opt_expiry = null;
        await user.save();
        return res
          .status(200)
          .json({ success: true, message: "User verified successfully" });
      }
    }

    if (!req?.body?.otp)
      return res
        .status(400)
        .json({ success: false, message: "Please provide OTP" });

    if (user.otp !== otp || user.opt_expiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    user.verified = true;
    user.otp = null;
    user.opt_expiry = null;

    await user.save();

    sendToken(res, user, 200, "Your account has been verified.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addProfilePhoto = async (req, res) => {
  try {
    const avatar = req.file;

    let user = await userModel.findById(req.user._id);

    user.avatar = {
      public_id: avatar.filename,
      url: avatar.path,
    };

    user.save();

    sendToken(res, user, 201, "Your profile photo has been updated.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    let user = await userModel
      .findOne({ email: email.toLowerCase() })
      .select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
    if (user.suspended) {
      return res
        .status(400)
        .json({ success: false, message: "Your account has been suspended" });
    }
    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    sendToken(res, user, 200, "You have been logged in.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found with this email" });
    }

    if (user.suspended) {
      return res
        .status(400)
        .json({ success: false, message: "Your account has been suspended" });
    }

    const otp = Math.floor(Math.random() * 1000000);
    user.otp = otp;
    user.opt_expiry = new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 1000);
    await user.save();

    sendMail(
      user.email,
      "Madhyayuga Password Reset",
      `
    Dear ${user.name},
    
    You have requested a password reset for your account on Madhyayuga.
    




    Your OTP is ${otp}
    



    Note: If you didnot request this, please ignore this email.


    Regards,
    Team Madhyayuga
    madhyayuga@gmail.com`
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP sent to your email please verify your account",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found with this email" });
    }
    const otp = Math.floor(Math.random() * 1000000);
    user.otp = otp;
    user.opt_expiry = new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 1000);
    await user.save();

    sendMail(
      user.email,
      "Madhyayuga Password Reset",
      `
    Dear ${user.name},
    
    You have requested a password reset for your account on Madhyayuga.
    
    Your OTP is ${otp}
    
    Regards,
    Team Madhyayuga
    madhyayuga@gmail.com`
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email for resetting your account",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    let user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.suspended) {
      return res
        .status(400)
        .json({ success: false, message: "Your account has been suspended" });
    }

    if (user.otp !== otp || user.opt_expiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or otp expired" });
    }

    user.password = password;
    user.otp = null;
    user.opt_expiry = null;

    await user.save();

    sendMail(
      user.email,
      "Madhyayuga Password Reset",
      `
    Dear ${user.name},

    Your password has been reset successfully.

    Regards,
    Team Madhyayuga
    madhyayuga@gmail.com`
    );

    sendToken(res, user, 200, "Password reset successful.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    sendToken(res, user, 201, `Welcome back ${user.name}`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null)
      .json({ success: true, message: "You have been logged out." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserByID = async (req, res) => {
  try {
    const { userId } = req.body;

    let user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Doesn't exist!" });
    }
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    };

    res.status(200).json({
      success: true,
      message: "Got user successfully!",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    if (!users)
      return res
        .status(400)
        .json({ success: false, message: "No users found!" });

    res.status(200).json({ success: true, documents: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { name, email, phone, userId } = req.body;

    if (userId !== req.user._id) {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action.",
        });
      }

      let user;
    }

    let user = await userModel.findById(req.user._id);

    user.name = name;
    user.email = email;
    user.phone = phone;

    await user.save();

    sendToken(res, user, 201, "User updated successfully.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, phone, _id, oldPassword, newPassword } = req.body;

    let user = await userModel.findById(_id).select("+password");
    if (oldPassword && !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password.",
      });
    }
    if (newPassword && !oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide your old password.",
      });
    }
    if (oldPassword && newPassword) {
      const passwordMatched = await user.comparePassword(oldPassword);
      if (!passwordMatched) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Password" });
      }
      await userModel.findByIdAndUpdate(
        _id,
        { password: newPassword },
        { new: true }
      );
    }

    if (_id !== req.user._id.toString()) {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action.",
        });
      }
    }

    user.name = name;
    user.phone = phone;

    await user.save();

    sendToken(res, user, 201, "User updated successfully.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    if (userId !== req.user._id) {
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to perform this action.",
        });
      }
    }
    let user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (req.user.isAdmin) {
      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Please provide a reason for deleting this user.",
        });
      }
    }

    await userModel.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const suspendUnsuspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    let user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (req.user.isAdmin) {
      if (!message && !user.suspended) {
        return res.status(400).json({
          success: false,
          message: "Please provide a reason for suspending this user.",
        });
      }
    }

    user.suspended = !user.suspended;
    await user.save();

    if (user.suspended) {
      sendMail(
        user.email,
        "Madhyayuga Account Suspended",
        `Your account has been suspended for the following reason: ${message}`
      );
    } else {
      sendMail(
        user.email,
        "Madhyayuga Account Unsuspended",
        `Your account has been unsuspended.`
      );
    }

    res.status(200).json({
      success: true,
      message: "User suspended/unsuspended successfully",
      document: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchToReview = async (req, res) => {
  try {
    const user = req.user._id;

    let reviews = await toReviewModel
      .find({ reviewer: user, reviewed: false })
      .populate("listing")
      .populate("reviewee", "name email avatar phone")
      .populate("reviewer", "name email avatar phone");

    if (!reviews) {
      return res
        .status(400)
        .json({ success: false, message: "No reviews found!" });
    }

    res.status(200).json({
      success: true,
      message: "Got reviews successfully!",
      documents: reviews,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const addToReview = async (req, res) => {
  try {
    const { reviewee, listing } = req.body;

    let user = await userModel.findById(reviewee);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    let existinglisting = await listingsModel.findById(listing);

    if (!existinglisting) {
      return res
        .status(400)
        .json({ success: false, message: "Listing not found" });
    }

    let existingReview = await toReviewModel.findOne({
      reviewee,
      reviewer: req.user._id,
      listing,
      reviewed: false,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ success: false, message: "Review already exists" });
    }

    let newReview = await toReviewModel.create({
      reviewee,
      reviewer: req.user._id,
      listing,
    });

    return res.status(200).json({
      success: true,
      message: "To Review added successfully!",
      document: newReview,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const reviewUser = async (req, res) => {
  try {
    const { reviewee, rating, review } = req.body;

    let user = await userModel.findById(reviewee);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User to receive review not found" });
    }

    let existingReview = await toReviewModel.findOne({
      reviewee,
      reviewer: req.user._id,
      reviewed: false,
    });

    if (!existingReview) {
      return res
        .status(400)
        .json({ success: false, message: "Review not found" });
    }

    let newReview = await toReviewModel.findByIdAndUpdate(
      existingReview._id,
      {
        reviewed: true,
        rating,
        review,
      },
      { new: true }
    );

    if (!newReview) {
      return res
        .status(400)
        .json({ success: false, message: "Review not updated" });
    }

    const revieweeUser = await userModel.findById(reviewee);

    revieweeUser.rating = revieweeUser.rating + rating;
    revieweeUser.totalRating = revieweeUser.totalRating + 1;

    await revieweeUser.save();

    return res.status(200).json({
      success: true,
      message: "Review added successfully!",
      document: newReview,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const fetchMyReviews = async (req, res) => {
  try {
    const user = req.user._id;

    let reviews = await toReviewModel
      .find({ reviewee: user, reviewed: true })
      .sort({ createdAt: -1 })
      .populate("reviewer", "name email avatar phone")
      .populate("listing")
      .populate("reviewee", "name email avatar phone");

    if (!reviews) {
      return res
        .status(400)
        .json({ success: false, message: "No reviews found!" });
    }

    res.status(200).json({
      success: true,
      message: "Got reviews successfully!",
      documents: reviews,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const fetchUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a user to get reviews",
      });
    }

    let reviews = await toReviewModel
      .find({ reviewee: userId, reviewed: true })
      .sort({ createdAt: -1 })
      .populate("reviewer", "name email avatar phone")
      .populate("listing")
      .populate("reviewee", "name email avatar phone");

    if (!reviews) {
      return res
        .status(400)
        .json({ success: false, message: "No reviews found!" });
    }

    res.status(200).json({
      success: true,
      message: "Got reviews successfully!",
      documents: reviews,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const addCredit = async (req, res) => {
  try {
    const { credit, amount, description } = req.body;

    if (!credit || !amount || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide credit and amount" });
    }
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    sendMail(
      user.email,
      "Madhyayuga Credit Added",
      `Dear ${user.name},
      
        Your account has been credited with ${credit} credits.

        Total credits: ${user.credit + credit}
        
        $${amount} has been deducted from your bank account.

        Payment Id: ${description}
        
        
        
        Regards,
        Team Madhyayuga
        madhyayuga@gmail.com`
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        credit: user.credit + credit,
      },
      { new: true }
    );

    await purchaseModel.create({
      user: req.user._id,
      amount,
      credit,
      paymentId: description,
    });

    return res.status(200).json({
      success: true,
      message: "Credit added successfully!",
      document: updatedUser,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const addPushToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a push token" });
    }
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { expoPushToken: token },
      { new: true }
    );
    sendToken(res, user, 200, "Push Token added successfully");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }
    let expo = new Expo({
      useFcmV1: true, // this can be set to true in order to use the FCM v1 API
    });

    const expoPushTokens = await userModel
      .find({ expoPushToken: { $ne: null } }, { expoPushToken: 1, _id: 0 })
      .lean()
      .exec();

    const tokens = expoPushTokens
      .map((user) => user.expoPushToken)
      .filter((token) => token);
    // Create the messages that you want to send to clients
    let messages = [];
    for (let pushToken of tokens) {
      // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: pushToken,
        sound: "default",
        body: body,
        title: title,
      });
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          console.error(error);
        }
      }
    })();

    const notification = await notificationModel.create({
      title,
      body,
    });

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully",
      document: notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });

    console.log(notifications);
    res.status(200).json({ success: true, documents: notifications ?? [] });
  } catch (error) {
    console.log(error.message, "notify");
    res.status(500).json({ success: false, message: error.message });
  }
};
