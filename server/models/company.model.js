
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    },
  logo: {
    url: { type: String, default: "" },
    public_id: { type: String, default: "" }
  },
  industry: {
    type: String,
    required: true,
    },
  description: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: {
  type: String,
  default: ""
}
}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);

export default Company;
