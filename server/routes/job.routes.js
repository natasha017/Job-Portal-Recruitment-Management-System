
import { Router } from "express";
import jobController from "../controllers/job.controller.js";
import authmiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createJobSchema, updateJobSchema } from "../validators/job.validator.js";

const router = Router();


router.get("/jobs", jobController.getAllJobs);
router.get("/jobs/public/:id", jobController.getPublicJobByID);


router.post(
  "/recruiter/jobs",
  authmiddleware,
  authorizeRoles("recruiter"),
  validate(createJobSchema),
  jobController.createJob
);

router.get(
  "/recruiter/jobs/my-jobs",
  authmiddleware,
  authorizeRoles("recruiter"),
  jobController.getMyJobs
);

router.get(
  "/recruiter/jobs/:id",
  authmiddleware,
  authorizeRoles("recruiter"),
  jobController.getJobByID
);

router.patch(
  "/recruiter/jobs/:id",
  authmiddleware,
  authorizeRoles("recruiter"),
  validate(updateJobSchema),
  jobController.updateJob
);

router.delete(
  "/recruiter/jobs/:id",
  authmiddleware,
  authorizeRoles("recruiter"),
  jobController.deleteJob
);

router.patch(
  "/recruiter/jobs/:id/publish",
  authmiddleware,
  authorizeRoles("recruiter"),
  jobController.publishJob
);

export default router;
