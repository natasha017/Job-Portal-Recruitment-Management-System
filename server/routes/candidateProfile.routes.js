
import { Router } from "express";
import candidateProfileController from "../controllers/candidateProfile.controller.js";
import authmiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { updateCandidateProfileSchema } from "../validators/candidateProfile.validator.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.use(authmiddleware, authorizeRoles("candidate"));

router.get(
  "/profile",
  candidateProfileController.getCandidateProfile
);

router.patch(
  "/profile",
  validate(updateCandidateProfileSchema),
  candidateProfileController.updateCandidateProfile
);

router.patch(
  "/profile/resume",
  upload.single("resume"),
  candidateProfileController.uploadResume
);

export default router;
