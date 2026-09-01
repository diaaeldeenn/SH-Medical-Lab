"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { NotificationI } from "@/interfaces/notification.interface";
import { markAsRead } from "@/action/notification.action";

interface NotificationCardProps {
  notification: NotificationI;
  onRead: (id: string) => void;
}

export default function NotificationCard({
  notification,
  onRead,
}: NotificationCardProps) {
  const [isMarking, setIsMarking] = useState(false);

  const handleClick = async () => {
    if (notification.isRead || isMarking) return;
    setIsMarking(true);
    try {
      await markAsRead(notification._id);
      onRead(notification._id);
    } catch {
      setIsMarking(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-3 px-5 py-4 text-right transition-colors",
        notification.isRead ? "bg-white" : "bg-[#F4F7F6] hover:bg-[#EDF3F1]",
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border",
          notification.isRead
            ? "bg-white border-[#D9E1E0] text-[#687576]"
            : "bg-white border-[#5E9C91]/30 text-[#5E9C91]",
        )}
      >
        <FlaskConical size={16} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#20292A] truncate">
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E9C91] shrink-0" />
          )}
        </div>
        <p className="text-xs text-[#687576] leading-relaxed">
          {notification.message}
        </p>
        <p className="text-[10px] text-[#687576]/80">
          {formatDistanceToNowStrict(new Date(notification.createdAt), {
            addSuffix: true,
            locale: ar,
          })}
        </p>
      </div>
    </button>
  );
}
