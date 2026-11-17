import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    enum: ["full-time", "part-time", "internship", "contract", "remote"],
    required: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
  min: {
    type: Number,
    default: 0,
    min: 0
  },
  max: {
    type: Number,
    default: 0,
    min: 0
  }
},
  skills: [{
    type: String,
    trim: true
  }],
  vacancies: {
    type: Number,
    default: 1,
    min: 1
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["draft", "published", "closed"],
    default: "draft"
  }
}, { timestamps: true });


jobSchema.pre("validate", function () {
  if (this.salary && this.salary.max < this.salary.min) {
    this.invalidate("salary.max", "Maximum salary cannot be less than minimum salary");
  }
});

const Job = mongoose.model("Job", jobSchema);

export default Job;