import type { Model } from "mongoose";
import BaseRepository from "./base.repository.js";
import type { NotificationI } from "../models/notification.model.js";
import notificationModel from "../models/notification.model.js";

class NotificationRepository extends BaseRepository<NotificationI> {
  constructor(protected readonly model: Model<NotificationI> = notificationModel) {
    super(model);
  }
}

export default NotificationRepository;