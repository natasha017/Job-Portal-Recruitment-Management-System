import CandidateProfile from "../models/candidateProfile.model.js";
import cloudinary from "../config/cloudinary.js";

const getCandidateProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({
      user: req.userId
    }).populate("user", "name email");

    if (!profile) {
      profile = await CandidateProfile.create({
        user: req.userId
      });

      profile = await profile.populate("user", "name email");
    }

    return res.status(200).json({
      success: true,
      message: "Candidate Profile Fetched Successfully",
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

const updateCandidateProfile = async (req, res, next) => {
  try {
    const { phone, location, headline, skills } = req.body;

    let profile = await CandidateProfile.findOne({
      user: req.userId
    });

    if (!profile) {
      profile = await CandidateProfile.create({
        user: req.userId
      });
    }

    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    if (headline !== undefined) profile.headline = headline;
    if (skills !== undefined) profile.skills = skills;

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Candidate Profile Updated Successfully",
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume"
      });
    }

    let profile = await CandidateProfile.findOne({
      user: req.userId
    });

    if (!profile) {
      profile = await CandidateProfile.create({
        user: req.userId
      });
    }

    const oldResumeId = profile.resume?.public_id;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "job-portal/candidate-resumes",
          resource_type: "raw",
          public_id: `resume-${req.userId}-${Date.now()}`,
          format: "pdf"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    profile.resume = {
      url: result.secure_url,
      public_id: result.public_id
    };

    await profile.save();

    if (oldResumeId) {
      try {
        await cloudinary.uploader.destroy(oldResumeId, {
          resource_type: "raw"
        });
      } catch (error) {
        console.error("Old resume deletion failed:", error.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Resume Uploaded Successfully",
      data: profile.resume
    });
  } catch (error) {
    next(error);
  }
};


const candidateController={
    getCandidateProfile,
    updateCandidateProfile,
    uploadResume
}

export default candidateController