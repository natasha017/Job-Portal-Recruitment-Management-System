
import Company from "../models/company.model.js";

const createCompany = async (req, res, next) => {
  try {
    const { name, industry, description, website, location } = req.body;

    const companyExist = await Company.findOne({
      recruiter: req.userId
    });

    if (companyExist) {
      return res.status(409).json({
        success: false,
        message: "Company Already Exists"
      });
    }

    const company = await Company.create({
      recruiter: req.userId,
      name,
      industry,
      description,
      website,
      location
    });

    return res.status(201).json({
      success: true,
      message: "Company Created Successfully",
      data: company
    });
  } catch (error) {
    next(error);
  }
};

const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      recruiter: req.userId
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company Not Found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company Fetched Successfully",
      data: company
    });
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const { name, industry, description, website, location } = req.body;

    const company = await Company.findOne({
      recruiter: req.userId
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company Not Found"
      });
    }

    if (name !== undefined) company.name = name;
    if (industry !== undefined) company.industry = industry;
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company Updated Successfully",
      data: company
    });
  } catch (error) {
    next(error);
  }
};

const companyController = {
  createCompany,
  getCompany,
  updateCompany
};

export default companyController;
