
import { Router } from "express";
import companyController from "../controllers/company.controller.js";
import { createCompanySchema, updateCompanySchema } from "../validators/company.validator.js";
import authmiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import upload from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/company")
  .post(authmiddleware,authorizeRoles("recruiter"),validate(createCompanySchema)
  ,companyController.createCompany
  )
  .get(
    authmiddleware,
    authorizeRoles("recruiter"),
    companyController.getCompany
  )
  .patch(
    authmiddleware,
    authorizeRoles("recruiter"),
    validate(updateCompanySchema),
    companyController.updateCompany
  );

router.route("/company/logo")
.patch(authmiddleware,authorizeRoles("recruiter"),
  upload.single("logo"),
  companyController.uploadCompanyLogo
);

export default router;
