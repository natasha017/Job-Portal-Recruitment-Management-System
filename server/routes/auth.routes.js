import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, registerSchema,resetPasswordSchema,resetPasswordTokenSchema } from "../validators/auth.validator.js";

const router=Router()

router.route("/register")
.post(validate(registerSchema),authController.register);

router.route("/login")
.post(validate(loginSchema),authController.login);

router.route("/logout")
.post(authController.logout)

router.route("/forgot-password")
.post(
    validate(forgotPasswordSchema),
    authController.forgotPassword
);

router.route("/reset-password/:token")
.post(
    validate(resetPasswordTokenSchema, "params"),
    validate(resetPasswordSchema),
    authController.resetPassword
);
router.route("/user")
.get(authController.user);

export default router