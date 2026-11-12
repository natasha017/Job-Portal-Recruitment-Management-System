import express from "express"
import authRouter from "./routes/auth.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js";

const app=express();

//middlewares
app.use(express.json());

app.use("/api/auth",authRouter);


//errorMiddleware
app.use(errorMiddleware);
export default app