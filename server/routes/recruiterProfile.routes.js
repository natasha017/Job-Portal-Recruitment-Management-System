
import { Router } from "express";
import recruiterProfileController from "../controllers/recruiterProfile.controller.js";
import updateRecruiterProfileSchema from "../validators/recruiterProfile.validator.js";

import authmiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/profile")
  .get(
    authmiddleware,
    authorizeRoles("recruiter"),
    recruiterProfileController.getRecruiterProfile
  )
  .patch(
    authmiddleware,
    authorizeRoles("recruiter"),
    validate(updateRecruiterProfileSchema),
    recruiterProfileController.updateRecruiterProfile
  );

router.patch(
  "/profile/image",
  authmiddleware,
  authorizeRoles("recruiter"),
  upload.single("image"),
  recruiterProfileController.uploadRecruiterImage
);

export default router;
