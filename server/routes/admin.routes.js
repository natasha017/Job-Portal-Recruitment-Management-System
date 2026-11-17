import { Router } from "express"; 
import authmiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import adminController from "../controllers/admin.Controller.js";
import validate from "../middlewares/validate.middleware.js";
import { updateUserStatusSchema } from "../validators/admin.validator.js";

const router = Router();

// Admin Authentication
router.use(authmiddleware, authorizeRoles("admin"));

// Get All Users
router.get("/users", adminController.getAllUsers);

// Block / Unblock User
router.patch(
  "/users/:id/status",
  validate(updateUserStatusSchema),
  adminController.updateUserStatus
);

// Get All Jobs
router.get("/jobs", adminController.getAllJobs);

// Delete Job
router.delete("/jobs/:id", adminController.deleteJob);

export default router;
