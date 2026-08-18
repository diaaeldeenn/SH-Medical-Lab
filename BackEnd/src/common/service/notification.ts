import {
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { Types } from "mongoose";
import NotificationRepository from "../../DB/repository/notification.repository.js";
import UserRepository from "../../DB/repository/user.repository.js";
import { NotificationType } from "../enum/notification.enum.js";

class NotificationConfig {
  private readonly client: App;
  private readonly notificationRepo = new NotificationRepository();
  private readonly userRepo = new UserRepository();

  constructor() {
    this.client =
      getApps().length > 0
        ? getApp()
        : initializeApp({
            credential: cert({
              projectId: process.env.PROJECT_ID!,
              clientEmail: process.env.CLIENT_EMAIL!,
              privateKey: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
            }),
          });
  }

  async sendNotification({
    token,
    data,
  }: {
    token: string;
    data: { title: string; body: string; type?: string };
  }) {
    return getMessaging(this.client).send({
      token,
      data,
    });
  }

  async sendNotifications({
    tokens,
    data,
  }: {
    tokens: string[];
    data: { title: string; body: string; type?: string };
  }) {
    await Promise.all(
      tokens.map((token) => this.sendNotification({ token, data })),
    );
  }
  async createAndSend({
    userId,
    type,
    title,
    message,
  }: {
    userId: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
  }) {
    const notification = await this.notificationRepo.create({
      user: userId,
      type,
      title,
      message,
      isRead: false,
    });

    const user = await this.userRepo.findById(userId);
    if (user?.fcmTokens?.length) {
      try {
        await this.sendNotifications({
          tokens: user.fcmTokens,
          data: {
            title,
            body: message,
            type,
          },
        });
      } catch (error) {
        console.error("Failed To Send Push Notification:", error);
      }
    }

    return notification;
  }
}

export default new NotificationConfig();
