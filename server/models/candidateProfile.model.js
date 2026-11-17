
import mongoose from "mongoose";

const candidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true,
    default: ""
  },
  location: {
    type: String,
    trim: true,
    default: ""
  },
  headline: {
    type: String,
    trim: true,
    default: ""
  },
  skills: [{
    type: String,
    trim: true
  }],
  resume: {
    url: {
      type: String,
      default: ""
    },
    public_id: {
      type: String,
      default: ""
    }
  }
}, { timestamps: true });

const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);

export default CandidateProfile;
