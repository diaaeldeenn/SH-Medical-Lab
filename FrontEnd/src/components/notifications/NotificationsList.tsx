"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { NotificationI } from "@/interfaces/notification.interface";
import NotificationCard from "@/components/notifications/NotificationCard";

interface NotificationsListProps {
  notifications: NotificationI[];
}

export default function NotificationsList({
  notifications: initialNotifications,
}: NotificationsListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  return (
    <div className="bg-white border border-[#D9E1E0] rounded-xl overflow-hidden divide-y divide-[#D9E1E0]">
      {notifications.map((notification, index) => (
        <motion.div
          key={notification._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
        >
          <NotificationCard notification={notification} onRead={handleRead} />
        </motion.div>
      ))}
    </div>
  );
}
