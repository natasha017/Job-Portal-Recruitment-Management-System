
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import CandidateProfile from "../models/candidateProfile.model.js";


const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findOne({
      _id: jobId,
      status: "published",
      deadline: { $gt: new Date() }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found or Deadline Expired"
      });
    }

    const profile = await CandidateProfile.findOne({
      user: req.userId
    });

    if (!profile || !profile.resume?.url) {
      return res.status(400).json({
        success: false,
        message: "Please Upload Your Resume First"
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.userId
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You Have Already Applied For This Job"
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.userId,
      coverLetter,
      resume: profile.resume,
      status: "applied"
    });

    return res.status(201).json({
      success: true,
      message: "Job Application Submitted Successfully",
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      candidate: req.userId
    })
      .populate("job", "title location jobType salary status deadline company")
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name logo"
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your Applications Fetched Successfully",
      total: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

const withdrawApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findOne({
      _id: id,
      candidate: req.userId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application Not Found"
      });
    }

    if (application.status === "withdrawn") {
      return res.status(400).json({
        success: false,
        message: "Application Already Withdrawn"
      });
    }

    if (application.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Rejected Application Cannot Be Withdrawn"
      });
    }

    application.status = "withdrawn";
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application Withdrawn Successfully",
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({
      _id: jobId,
      recruiter: req.userId
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found"
      });
    }

    const applications = await Application.find({
      job: jobId
    })
      .populate("candidate", "name email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Job Applications Fetched Successfully",
      total: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["reviewing", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Application Status"
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application Not Found"
      });
    }

    const job = await Job.findOne({
      _id: application.job,
      recruiter: req.userId
    });

    if (!job) {
      return res.status(403).json({
        success: false,
        message: "You Are Not Authorized To Manage This Application"
      });
    }

    if (["withdrawn", "rejected"].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: "This Application Cannot Be Updated"
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application Status Updated Successfully",
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const applicationController = {
  applyJob,
  getMyApplications,
  withdrawApplication,
  getJobApplications,
  updateApplicationStatus
};

export default applicationController;
