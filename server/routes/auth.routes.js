import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router=Router()

router.route("/register")
.post(authController.register);

router.route("/login")
.post(authController.login);

router.route("/user")
.get(authController.user);

export default router