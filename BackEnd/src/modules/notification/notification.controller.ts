import { Router } from "express";
import {
  authentication,
  authorization,
} from "../../common/middleware/auth.middleware.js";
import { UserRole } from "../../common/enum/user.enum.js";
import NotificationService from "./notification.service.js";

const notificationRouter = Router();

notificationRouter.get(
  "/",
  authentication,
  authorization([UserRole.PATIENT]),
  NotificationService.getPatientNotifications,
);

notificationRouter.patch(
  "/:notificationId/read",
  authentication,
  authorization([UserRole.PATIENT]),
  NotificationService.markAsRead,
);

notificationRouter.patch(
  "/read-all",
  authentication,
  authorization([UserRole.PATIENT]),
  NotificationService.markAllAsRead,
);

export default notificationRouter;
