import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import recruiterProfileRouter from "./routes/recruiterProfile.routes.js";
import companyRouter from "./routes/company.routes.js";
import adminCompanyRouter from "./routes/adminCompany.routes.js";
import jobRouter from "./routes/job.routes.js";
import candidateProfileRouter from "./routes/candidateProfile.routes.js";
import applicationRouter from "./routes/application.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Auth Routes
app.use("/api/auth", authRouter);

// Recruiter Routes
app.use("/api/recruiter", recruiterProfileRouter);
app.use("/api/recruiter", companyRouter);

// Admin Routes
app.use("/api/admin", adminCompanyRouter);
app.use("/api/admin", adminRouter);

// Job Routes
app.use("/api", jobRouter);

// Candidate Routes
app.use("/api/candidate", candidateProfileRouter);

// Application Routes
app.use("/api", applicationRouter);

// Dashboard Routes
app.use("/api/dashboard", dashboardRouter);

// Error Middleware
app.use(errorMiddleware);

export default app;