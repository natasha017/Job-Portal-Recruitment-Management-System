import { Router } from "express";
import adminCompanyController from "../controllers/adminCompany.controller.js";
import authmiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import rejectCompanySchema from "../validators/adminCompany.validator.js";

const router = Router();

router.use(authmiddleware, authorizeRoles("admin"));


router.route("/companies/pending")
.get(adminCompanyController.getPendingCompanies);


router.route("/companies/:id")
.get( adminCompanyController.getCompanyById);

router.route("/companies/:id/approve")
.patch(adminCompanyController.approveCompany);

router.route("/companies/:id/reject")
.patch(validate(rejectCompanySchema),adminCompanyController.rejectCompany);

export default router;