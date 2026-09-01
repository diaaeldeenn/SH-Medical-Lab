"use client";

import { motion } from "motion/react";
import { FlaskConical } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { ar } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { NotificationI } from "@/interfaces/notification.interface";

interface NotificationBellItemProps {
  notification: NotificationI;
  index: number;
}

export default function NotificationBellItem({
  notification,
  index,
}: NotificationBellItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn(
        "flex items-start gap-2.5 px-4 py-3",
        notification.isRead ? "bg-white" : "bg-[#F4F7F6]",
      )}
    >
      <div className="w-7 h-7 rounded-lg bg-white border border-[#D9E1E0] flex items-center justify-center shrink-0 text-[#5E9C91]">
        <FlaskConical size={13} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-xs font-semibold text-[#20292A] truncate">
          {notification.title}
        </p>
        <p className="text-[11px] text-[#687576] line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <p className="text-[10px] text-[#687576]/80">
          {formatDistanceToNowStrict(new Date(notification.createdAt), {
            addSuffix: true,
            locale: ar,
          })}
        </p>
      </div>

      {!notification.isRead && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#5E9C91] shrink-0 mt-1.5" />
      )}
    </motion.div>
  );
}
