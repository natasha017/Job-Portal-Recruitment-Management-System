
import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import authmiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = Router();

router.use(authmiddleware);

// Admin Dashboard
router.get(
  "/admin",
  authorizeRoles("admin"),
  dashboardController.getAdminDashboard
);

// Recruiter Dashboard
router.get(
  "/recruiter",
  authorizeRoles("recruiter"),
  dashboardController.getRecruiterDashboard
);

// Candidate Dashboard
router.get(
  "/candidate",
  authorizeRoles("candidate"),
  dashboardController.getCandidateDashboard
);

export default router;
