import {upload} from "../config/cloudinary.js";
import reviewsModel from "../models/reviews.js";
import {userModel} from "../models/user.js";
import {sendMail} from "../utils/sendMail.js";
import {sendToken} from "../utils/sendToken.js";
import {toReviewModel} from "../models/toReview.js";

export const register = async (req, res) => {
    try {
        const {name, email, password, phone} = req.body;
        // const avatar = req.file;

        let user = await userModel.findOne({email: email.toLowerCase()});

        if (user) {
            return res
                .status(409)
                .json({success: false, message: "Email is already in use!"});
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
        await sendMail(user.email, "Verify your account", `Your OTP is ${otp}`);
        sendToken(
            res,
            user,
            201,
            "OTP sent to your email please verify your account"
        );
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

export const verifyUser = async (req, res) => {
    try {
        const otp = Number(req.body.otp);

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res
                .status(400)
                .json({success: false, message: "User not found"});
        }

        if (req?.user?.isAdmin) {
            if (user.verified) {
                user.verified = false;
                user.otp = null;
                user.opt_expiry = null;
                await user.save();
                return res
                    .status(200)
                    .json({success: true, message: "User unverified successfully"});
            } else {
                user.verified = true;
                user.otp = null;
                user.opt_expiry = null;
                await user.save();
                return res
                    .status(200)
                    .json({success: true, message: "User verified successfully"});
            }
        }

        if (!req?.body?.otp)
            return res
                .status(400)
                .json({success: false, message: "Please provide OTP"});

        if (user.otp !== otp || user.opt_expiry < Date.now()) {
            return res.status(400).json({success: false, message: "Invalid OTP"});
        }
        user.verified = true;
        user.otp = null;
        user.opt_expiry = null;

        await user.save();

        sendToken(res, user, 200, "Your account has been verified.");
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
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
        res.status(500).json({success: false, message: error.message});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({success: false, message: "Invalid Email or Password"});
        }

        let user = await userModel
            .findOne({email: email.toLowerCase()})
            .select("+password");

        if (!user) {
            return res
                .status(400)
                .json({success: false, message: "Invalid Email or Password"});
        }
        const passwordMatched = await user.comparePassword(password);

        if (!passwordMatched) {
            return res
                .status(400)
                .json({success: false, message: "Invalid Email or Password"});
        }

        sendToken(res, user, 200, "You have been logged in.");
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        sendToken(res, user, 201, `Welcome back ${user.name}`);
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

export const logout = async (req, res) => {
    try {
        res
            .status(200)
            .cookie("token", null, {
                expires: new Date(Date.now()),
            })
            .json({success: true, message: "You have been logged out."});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

export const getUserByID = async (req, res) => {
    try {
        const {userId} = req.body;

        let user = await userModel.findById(userId);

        if (!user) {
            return res
                .status(400)
                .json({success: false, message: "User Doesn't exist!"});
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
        res.status(500).json({success: false, message: error.message});
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        if (!users)
            return res
                .status(400)
                .json({success: false, message: "No users found!"});

        res.status(200).json({success: true, documents: users});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

export const editUser = async (req, res) => {
    try {
        const {name, email, phone, userId} = req.body;

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
        res.status(500).json({success: false, message: error.message});
    }
};

export const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const {message} = req.body;

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
                .json({success: false, message: "User not found"});
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
            .json({success: true, message: "User deleted successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

export const suspendUnsuspendUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const {message} = req.body;

        let user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(400)
                .json({success: false, message: "User not found"});
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
                "Account Suspended",
                `Your account has been suspended for the following reason: ${message}`
            );
        } else {
            sendMail(
                user.email,
                "Account Unsuspended",
                `Your account has been unsuspended.`
            );
        }

        res.status(200).json({
            success: true,
            message: "User suspended/unsuspended successfully",
            document: user,
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

export const fetchToReview = async (req, res) => {
    try {
        const user = req.user._id;

        let reviews = await toReviewModel
            .find({reviewer: user, reviewed: false})
            .populate("listing").populate("reviewee", "name email avatar phone").populate("reviewer", "name email avatar phone");

        if (!reviews) {
            return res
                .status(400)
                .json({success: false, message: "No reviews found!"});
        }

        res.status(200).json({
            success: true,
            message: "Got reviews successfully!",
            documents: reviews,
        });
    } catch (e) {
        return res.status(500).json({success: false, message: e.message});
    }
}

export const addToReview = async (req, res) => {
    try {
        const {reviewee, listing} = req.body;

        let user = await userModel.findById(reviewee);
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"});
        }

        let existinglisting = await listingsModel.findById(listing);

        if (!existinglisting) {
            return res.status(400).json({success: false, message: "Listing not found"});
        }

        let existingReview = await toReviewModel.findOne({reviewee, reviewer: req.user._id, listing, reviewed: false});

        if (existingReview) {
            return res.status(400).json({success: false, message: "Review already exists"});
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
        return res.status(500).json({success: false, message: e.message});
    }

}

export const reviewUser = async (req, res) => {
    try {
        const {reviewee, rating, review} = req.body;

        let user = await userModel.findById(reviewee);

        if (!user) {
            return res
                .status(400)
                .json({success: false, message: "User to receive review not found"});
        }

        let existingReview = await toReviewModel.findOne({reviewee, reviewer: req.user._id, reviewed: false});

        if (!existingReview) {
            return res
                .status(400)
                .json({success: false, message: "Review not found"});
        }

        let newReview = await toReviewModel.findByIdAndUpdate(existingReview._id, {
            reviewed: true,
            rating,
            review
        }, {new: true});

        if (!newReview) {
            return res.status(400).json({success: false, message: "Review not updated"});
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
        return res.status(500).json({success: false, message: e.message});
    }
}



