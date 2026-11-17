
import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

// Get All Users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users Fetched Successfully",
      totalUsers: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Block / Unblock User
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isBlocked must be true or false"
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin Account Cannot Be Blocked"
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    return res.status(200).json({
      success: true,
      message: isBlocked
        ? "User Blocked Successfully"
        : "User Unblocked Successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get All Jobs
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate("recruiter", "name email")
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All Jobs Fetched Successfully",
      totalJobs: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// Delete Job
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found"
      });
    }

    await Application.deleteMany({ job: id });
    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Job And Related Applications Deleted Successfully"
    });
  } catch (error) {
    next(error);
  }
};

const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllJobs,
  deleteJob
};

export default adminController;

