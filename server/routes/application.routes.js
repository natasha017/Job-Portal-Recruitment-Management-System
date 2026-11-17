
import { Router } from "express";
import applicationController from "../controllers/application.controller.js";
import validate from "../middlewares/validate.middleware.js";

import {
  applyJobSchema,
  updateApplicationStatusSchema
} from "../validators/application.validator.js";

import authmiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();

// Candidate Routes
router.post(
  "/jobs/:jobId/apply",
  authmiddleware,
  authorizeRoles("candidate"),
  validate(applyJobSchema),
  applicationController.applyJob
);

router.get(
  "/candidate/applications",
  authmiddleware,
  authorizeRoles("candidate"),
  applicationController.getMyApplications
);

router.patch(
  "/applications/:id/withdraw",
  authmiddleware,
  authorizeRoles("candidate"),
  applicationController.withdrawApplication
);

// Recruiter Routes
router.get(
  "/recruiter/jobs/:jobId/applications",
  authmiddleware,
  authorizeRoles("recruiter"),
  applicationController.getJobApplications
);

router.patch(
  "/recruiter/applications/:id/status",
  authmiddleware,
  authorizeRoles("recruiter"),
  validate(updateApplicationStatusSchema),
  applicationController.updateApplicationStatus
);

export default router;
