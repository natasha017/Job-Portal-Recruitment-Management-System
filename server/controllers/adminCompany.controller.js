import Company from "../models/company.model.js"

const getPendingCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({
      verificationStatus: "pending"
    }).populate("recruiter", "name email");

    return res.status(200).json({
      success: true,
      message: "Pending companies fetched successfully",
      data: companies,
      total: companies.length
    });
  } catch (error) {
    next(error);
  }
};

const getCompanyById=async(req,res,next)=>{
    try {

        const{id}=req.params

        const company=await Company.findById(id)
        .populate("recruiter", "name email")

        if(!company){
            return res.status(404).json({
                success:false,
                messageL:"Company not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Company details fetched successfully",
            data:company
        });
    
    } catch (error) {
        next(error)
    }
}

const approveCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company Not Found"
      });
    }

    if (company.verificationStatus === "approved") {
      return res.status(400).json({
        success: false,
        message: "Company Already Approved"
      });
    }

    company.verificationStatus = "approved";
    company.rejectionReason = "";

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company Approved Successfully",
      data: company
    });
  } catch (error) {
    next(error);
  }
};

const rejectCompany = async (req,res,next)=>{
    try {
        const {id}=req.params
        const {reason}=req.body

        const company=await Company.findOne({id})

        if(!comapny){
            return res.status(404).json({
                success:false,
                message:"Company not found"
            })
        }

        company.verificationStatus = "rejected";
        company.rejectionReason = reason

        await company.save();

        return res.status(200).json({
        success: true,
        message: "Company Rejected Successfully",
        data: company
    });
    } catch (error) {
        next(error)
    }
}

const adminCompanyController={
    getPendingCompanies,
    getCompanyById,
    approveCompany,
    rejectCompany
}

export default adminCompanyController

