import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import {
  AppError,
  globalErrorHandler,
} from "./common/utils/global/response.error.js";
import authRouter from "./modules/auth/auth.controller.js";
import testRouter from "./modules/test/test.controller.js";
import requestRouter from "./modules/labRequest/request.controller.js";
import resultRouter from "./modules/result/result.controller.js";
import notificationRouter from "./modules/notification/notification.controller.js";

const app: express.Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 200 requests per `window`
  message: "To Many Request Try After 15 Minutes",
  legacyHeaders: false,
});

app.use(cors(), helmet(), limiter, express.json());
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome In SH Medical Lab" });
});

app.use("/auth", authRouter);
app.use("/test", testRouter);
app.use("/request", requestRouter);
app.use("/result", resultRouter);
app.use("/notifications", notificationRouter);

app.use("{/*demo}", (req: Request, res: Response) => {
  throw new AppError(`Url ${req.originalUrl} Not Found!`, 404);
});
app.use(globalErrorHandler);
export default app;
