export const sendToken = (res, user, statusCode, message) => {
  const token = user.getJWTToken();
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    verified: user.verified,
    createdAt: user.createdAt,
    rating: user.rating,
    totalRating: user.totalRating,
    credit: user.credit,
    isAdmin: user.isAdmin,
    suspended: user.suspended,
    expoPushToken: user.expoPushToken,
    location: user.location,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, message, user: userData, token: token });
};
