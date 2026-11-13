import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import authmiddleware from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register")
.post(validate(registerSchema),authController.register);

router.route("/login")
.post(validate(loginSchema),authController.login);

router.route("/user")
.get(authController.user);

export default router