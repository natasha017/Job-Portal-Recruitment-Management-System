
import Job from "../models/job.model.js";
import Company from "../models/company.model.js";
import Application from "../models/application.model.js";

const createJob = async (req, res, next) => {
  try {
    const {
      company,
      title,
      description,
      category,
      location,
      jobType,
      experience,
      salary,
      skills,
      vacancies,
      deadline
    } = req.body;

    const companyExist = await Company.findOne({
      _id: company,
      recruiter: req.userId
    });

    if (!companyExist) {
      return res.status(404).json({
        success: false,
        message: "Company Not Found"
      });
    }

    if (companyExist.verificationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your Company Is Not Approved Yet"
      });
    }

    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Deadline Must Be In The Future"
      });
    }

    const job = await Job.create({
      recruiter: req.userId,
      company: companyExist._id,
      title,
      description,
      category,
      location,
      jobType,
      experience,
      salary,
      skills,
      vacancies,
      deadline,
      status: "draft"
    });

    return res.status(201).json({
      success: true,
      message: "Job Created Successfully",
      data: job
    });

  } catch (error) {
    next(error);
  }
};

const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      recruiter: req.userId
    })
      .populate("company", "name logo industry")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your Jobs Fetched Successfully",
      total: jobs.length,
      data: jobs
    });

  } catch (error) {
    next(error);
  }
};

const getJobByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      recruiter: req.userId
    }).populate("company", "name logo industry location website");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job Details Fetched Successfully",
      data: job
    });

  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      location,
      jobType,
      experience,
      salary,
      skills,
      vacancies,
      deadline
    } = req.body;

    const job = await Job.findOne({
      _id: id,
      recruiter: req.userId
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found"
      });
    }

    if (job.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Closed Jobs Cannot Be Updated"
      });
    }

    if (deadline !== undefined) {
      const parsedDeadline = new Date(deadline);

      if (
        Number.isNaN(parsedDeadline.getTime()) ||
        parsedDeadline <= new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Deadline Must Be A Valid Future Date"
        });
      }
    }

    // Validate salary
    if (salary !== undefined) {
      const minSalary = salary.min ?? job.salary.min;
      const maxSalary = salary.max ?? job.salary.max;

      if (
        !Number.isFinite(Number(minSalary)) ||
        !Number.isFinite(Number(maxSalary)) ||
        Number(minSalary) < 0 ||
        Number(maxSalary) < Number(minSalary)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid Salary Range. Maximum salary must be greater than or equal to minimum salary."
        });
      }

      job.salary = {
        min: Number(minSalary),
        max: Number(maxSalary)
      };
    }

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (category !== undefined) job.category = category;
    if (location !== undefined) job.location = location;
    if (jobType !== undefined) job.jobType = jobType;
    if (experience !== undefined) job.experience = experience;
    if (skills !== undefined) job.skills = skills;
    if (vacancies !== undefined) job.vacancies = vacancies;
    if (deadline !== undefined) job.deadline = deadline;

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job Updated Successfully",
      data: job
    });

  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      recruiter: req.userId
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found"
      });
    }

    // Delete all applications related to this job
    await Application.deleteMany({
      job: job._id
    });

    // Delete the job
    await Job.findByIdAndDelete(job._id);

    return res.status(200).json({
      success: true,
      message: "Job And Related Applications Deleted Successfully"
    });

  } catch (error) {
    next(error);
  }
};

const publishJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      recruiter: req.userId
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found"
      });
    }

    if (job.status === "published") {
      return res.status(400).json({
        success: false,
        message: "Job Is Already Published"
      });
    }

    if (job.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Closed Job Cannot Be Published"
      });
    }

    const company = await Company.findById(job.company);

    if (!company || company.verificationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your Company Is Not Approved"
      });
    }

    if (job.deadline <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Job Deadline Has Expired"
      });
    }

    job.status = "published";

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job Published Successfully",
      data: job
    });

  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      status: "published",
      deadline: { $gt: new Date() }
    })
      .populate("company", "name logo industry location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Published Jobs Fetched Successfully",
      total: jobs.length,
      data: jobs
    });

  } catch (error) {
    next(error);
  }
};

const getPublicJobByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      status: "published",
      deadline: { $gt: new Date() }
    }).populate("company", "name logo industry location website");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Published Job Not Found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job Details Fetched Successfully",
      data: job
    });

  } catch (error) {
    next(error);
  }
};

const jobController = {
  createJob,
  getMyJobs,
  getJobByID,
  updateJob,
  deleteJob,
  publishJob,
  getAllJobs,
  getPublicJobByID
};

export default jobController;
