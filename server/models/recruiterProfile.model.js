
import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    profileImage: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    linkedin: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const RecruiterProfile = mongoose.model("RecruiterProfile",recruiterProfileSchema);

export default RecruiterProfile;
