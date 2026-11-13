
import { z } from "zod";

// Register Validation
export const registerSchema = z.object({
    name: z
        .string({ error: "Name is required" })
        .trim()
        .toLowerCase()
        .min(3, { message: "Name must be at least 3 characters" }),

    email: z
        .string({ error: "Email is required" })
        .trim()
        .email({ message: "Invalid email address" })
        .toLowerCase(),

    password: z
        .string({ error: "Password is required" })
        .min(10, { message: "Password must be at least 10 characters" })
});

// Login Validation
export const loginSchema = z.object({
    email: z
        .string({ error: "Email is required" })
        .trim()
        .email({ message: "Invalid email address" })
        .toLowerCase(),

    password: z
        .string({ error: "Password is required" })
        .min(1, { message: "Password is required" })
});

// Forgot Password Validation
export const forgotPasswordSchema = z.object({
    email: z
        .string({ error: "Email is required" })
        .trim()
        .email({ message: "Invalid email address" })
        .toLowerCase()
});

// Reset Password Token Validation
export const resetPasswordTokenSchema = z.object({
    token: z
        .string({ error: "Reset token is required" })
        .length(64, { message: "Invalid reset token" })
        .regex(/^[a-f0-9]{64}$/, {
            message: "Invalid reset token format"
        })
});

export const resetPasswordSchema = z.object({
    password: z
        .string({ error: "Password is required" })
        .min(10, { message: "Password must be at least 10 characters" })
});


