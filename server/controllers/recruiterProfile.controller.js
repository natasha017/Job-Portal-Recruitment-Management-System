import RecruiterProfile from "../models/recruiterProfile.model.js"
import cloudinary from "../config/cloudinary.js";
import Company from "../models/company.model.js";

const getRecruiterProfile = async (req, res, next) => {
  try {
    const recruiterExist = await RecruiterProfile.findOne({
      user: req.userId,
    });

    if (!recruiterExist) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Profile Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recruiter Profile Fetched Successfully",
      data: recruiterExist,
    });

  } catch (error) {
    next(error);
  }
};

const updateRecruiterProfile = async (req, res, next) => {
  try {
    const { phone, designation, bio, linkedin, website } = req.body;
    const userId = req.userId;

    const recruiterExist = await RecruiterProfile.findOne({ user: userId });

    if (!recruiterExist) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Profile Not Found",
      });
    }

    if (phone !== undefined) recruiterExist.phone = phone;
    if (designation !== undefined) recruiterExist.designation = designation;
    if (bio !== undefined) recruiterExist.bio = bio;
    if (linkedin !== undefined) recruiterExist.linkedin = linkedin;
    if (website !== undefined) recruiterExist.website = website;

    await recruiterExist.save();

    return res.status(200).json({
      success: true,
      message: "Recruiter Profile Updated Successfully",
      data: recruiterExist,
    });
  } catch (error) {
    next(error);
  }
};

const uploadRecruiterImage = async (req, res, next) => {
  let uploadedImage;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please Upload an Image",
      });
    }

    const recruiterExist = await RecruiterProfile.findOne({
      user: req.userId,
    });

    if (!recruiterExist) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Profile Not Found",
      });
    }

    const oldImage = recruiterExist.profileImage?.public_id;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "job-portal/recruiter-profiles",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    uploadedImage = result;

    recruiterExist.profileImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await recruiterExist.save();

    if (oldImage) {
      try {
        await cloudinary.uploader.destroy(oldImage);
      } catch (error) {
        console.error("Old image deletion failed:", error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Recruiter Profile Image Updated Successfully",
      data: recruiterExist.profileImage,
    });

  } catch (error) {
    
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed:", cleanupError);
      }
    }

    next(error);
  }
};

const uploadCompanyLogo = async (req, res, next) => {
  let uploadedImage;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please Upload Company Logo"
      });
    }

    const company = await Company.findOne({
      recruiter: req.userId
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company Not Found"
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "job-portal/company-logos",
          resource_type: "image"
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    uploadedImage = result;

    const oldLogo = company.logo?.public_id;

    company.logo = {
      url: result.secure_url,
      public_id: result.public_id
    };

    await company.save();

    if (oldLogo) {
      try {
        await cloudinary.uploader.destroy(oldLogo);
      } catch (error) {
        console.error("Old Logo Deletion Failed:", error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Company Logo Uploaded Successfully",
      data: company.logo
    });

  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error("Logo Cleanup Failed:", cleanupError);
      }
    }

    next(error);
  }
};


const recruiterProfileController={
    getRecruiterProfile,
    updateRecruiterProfile,
    uploadRecruiterImage,
    uploadCompanyLogo 
}

export default recruiterProfileController
