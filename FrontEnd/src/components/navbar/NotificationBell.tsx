"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Bell } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMyNotification } from "@/action/notification.action";
import { NotificationI } from "@/interfaces/notification.interface";
import NotificationBellItem from "@/components/navbar/NotificationBellItem";

const PREVIEW_LIMIT = 5;

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await getMyNotification(1, PREVIEW_LIMIT);
      setNotifications(response.data?.data ?? []);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) fetchNotifications();
      }}
    >
      <PopoverTrigger
        className="relative w-9 h-9 rounded-full border border-[#D9E1E0] bg-[#F4F7F6] hover:border-[#5E9C91] hover:bg-[#EDF3F1] flex items-center justify-center text-[#263B3D] transition-colors outline-none cursor-pointer"
        aria-label="الإشعارات"
      >
        <Bell size={16} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -left-0.5 min-w-4 h-4 px-1 rounded-full bg-[#5E9C91] text-white text-[9px] font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-80 p-0 rounded-xl border border-[#D9E1E0] overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-[#D9E1E0] bg-[#F4F7F6]">
          <p className="text-sm font-bold text-[#20292A]">الإشعارات</p>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-[#D9E1E0]">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-xs text-[#687576]">
              جارٍ التحميل...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-[#687576]">
              لا توجد إشعارات حتى الآن
            </div>
          ) : (
            notifications.map((notification, index) => (
              <NotificationBellItem
                key={notification._id}
                notification={notification}
                index={index}
              />
            ))
          )}
        </div>

        <Link
          href="/notifications"
          onClick={() => setOpen(false)}
          className="block px-4 py-2.5 text-center text-xs font-medium text-[#5E9C91] hover:text-[#4E887E] hover:bg-[#F4F7F6] transition-colors border-t border-[#D9E1E0]"
        >
          عرض كل الإشعارات
        </Link>
      </PopoverContent>
    </Popover>
  );
}
