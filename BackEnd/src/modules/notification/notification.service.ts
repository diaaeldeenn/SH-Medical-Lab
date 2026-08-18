import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import NotificationRepository from "../../DB/repository/notification.repository.js";
import { successResponse } from "../../common/utils/global/response.success.js";
import { AppError } from "../../common/utils/global/response.error.js";

class NotificationService {
  private readonly notificationRepo = new NotificationRepository();

  getPatientNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!._id;
      const { page, limit } = req.query;

      const result = await this.notificationRepo.pagination({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sort: { createdAt: -1 },
        search: { user: userId },
      });

      return successResponse({
        res,
        message: "Notifications Fetched Successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user!._id;
      if (
        !notificationId ||
        typeof notificationId !== "string" ||
        !Types.ObjectId.isValid(notificationId)
      ) {
        throw new AppError("Invalid Notification ID", 400);
      }
      const notification = await this.notificationRepo.findOneAndUpdate({
        filter: { _id: new Types.ObjectId(notificationId), user: userId },
        update: { isRead: true },
      });

      if (!notification) {
        throw new AppError("Notification Not Found", 404);
      }

      return successResponse({
        res,
        message: "Notification Marked As Read",
        data: notification,
      });
    } catch (error) {
      return next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!._id;

      await this.notificationRepo.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true } },
      );

      return successResponse({
        res,
        message: "All Notifications Marked As Read",
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default new NotificationService();
