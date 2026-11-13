
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



