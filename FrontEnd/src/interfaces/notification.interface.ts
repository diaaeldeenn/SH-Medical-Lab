export interface NotificationI {
  _id: string;
  user: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
