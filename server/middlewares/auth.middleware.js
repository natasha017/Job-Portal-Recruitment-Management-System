
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authmiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first."
      });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userData = await User.findById(decoded.userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again."
      });
    }

    if (userData.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked."
      });
    }

    req.user = userData;
    req.userId = userData._id.toString();
    req.token = token;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again."
      });
    }

    next(error);
  }
};

export default authmiddleware;
