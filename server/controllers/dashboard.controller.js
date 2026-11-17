import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import Company from "../models/company.model.js";
import Application from "../models/application.model.js";

const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      publishedJobs,
      draftJobs,
      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      totalApplications
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "recruiter" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "published" }),
      Job.countDocuments({ status: "draft" }),
      Company.countDocuments(),
      Company.countDocuments({ verificationStatus: "pending" }),
      Company.countDocuments({ verificationStatus: "approved" }),
      Application.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Data Fetched Successfully",
      data: {
        users: {
          total: totalUsers,
          candidates: totalCandidates,
          recruiters: totalRecruiters
        },
        jobs: {
          total: totalJobs,
          published: publishedJobs,
          draft: draftJobs
        },
        companies: {
          total: totalCompanies,
          pending: pendingCompanies,
          approved: approvedCompanies
        },
        applications: {
          total: totalApplications
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getRecruiterDashboard = async (req, res, next) => {
  try {
    const recruiterId = req.userId;

    const jobIds = await Job.find({
      recruiter: recruiterId
    }).distinct("_id");

    const [
      totalJobs,
      publishedJobs,
      draftJobs,
      totalApplications,
      reviewingApplications,
      shortlistedApplications,
      rejectedApplications
    ] = await Promise.all([
      Promise.resolve(jobIds.length),
      Job.countDocuments({ recruiter: recruiterId, status: "published" }),
      Job.countDocuments({ recruiter: recruiterId, status: "draft" }),
      Application.countDocuments({ job: { $in: jobIds } }),
      Application.countDocuments({ job: { $in: jobIds }, status: "reviewing" }),
      Application.countDocuments({ job: { $in: jobIds }, status: "shortlisted" }),
      Application.countDocuments({ job: { $in: jobIds }, status: "rejected" })
    ]);

    return res.status(200).json({
      success: true,
      message: "Recruiter Dashboard Data Fetched Successfully",
      data: {
        jobs: {
          total: totalJobs,
          published: publishedJobs,
          draft: draftJobs
        },
        applications: {
          total: totalApplications,
          reviewing: reviewingApplications,
          shortlisted: shortlistedApplications,
          rejected: rejectedApplications
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCandidateDashboard = async (req, res, next) => {
  try {
    const candidateId = req.userId;

    const [
      totalApplications,
      appliedApplications,
      reviewingApplications,
      shortlistedApplications,
      rejectedApplications,
      withdrawnApplications
    ] = await Promise.all([
      Application.countDocuments({ candidate: candidateId }),
      Application.countDocuments({ candidate: candidateId, status: "applied" }),
      Application.countDocuments({ candidate: candidateId, status: "reviewing" }),
      Application.countDocuments({ candidate: candidateId, status: "shortlisted" }),
      Application.countDocuments({ candidate: candidateId, status: "rejected" }),
      Application.countDocuments({ candidate: candidateId, status: "withdrawn" })
    ]);

    return res.status(200).json({
      success: true,
      message: "Candidate Dashboard Data Fetched Successfully",
      data: {
        applications: {
          total: totalApplications,
          applied: appliedApplications,
          reviewing: reviewingApplications,
          shortlisted: shortlistedApplications,
          rejected: rejectedApplications,
          withdrawn: withdrawnApplications
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const dashboardController = {
  getAdminDashboard,
  getRecruiterDashboard,
  getCandidateDashboard
};

export default dashboardController;