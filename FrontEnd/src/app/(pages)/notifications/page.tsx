import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BellOff } from "lucide-react";
import { authOptions } from "@/lib/nextAuth/auth";
import { getMyNotification } from "@/action/notification.action";
import { NotificationI } from "@/interfaces/notification.interface";
import RequestsPagination from "@/components/home/RequestsPagination";
import NotificationsList from "@/components/notifications/NotificationsList";
import MarkAllReadButton from "@/components/notifications/MarkAllReadButton";

const LIMIT = 10;

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "PATIENT") {
    redirect("/");
  }

  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const response = await getMyNotification(currentPage, LIMIT).catch(
    () => null,
  );
  const notifications: NotificationI[] = response?.data?.data ?? [];
  const totalPages: number = response?.data?.meta?.totalPages ?? 1;
  const hasUnread = notifications.some((notification) => !notification.isRead);

  return (
    <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#20292A]">الإشعارات</h1>
            <p className="text-sm text-[#687576] mt-1">
              تنبيهات ظهور نتائج تحاليلك أول بأول
            </p>
          </div>
          {hasUnread && <MarkAllReadButton />}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white border border-dashed border-[#D9E1E0] rounded-xl px-6 py-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4F7F6] flex items-center justify-center mx-auto">
              <BellOff className="w-5 h-5 text-[#5E9C91]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#20292A]">
                لا توجد إشعارات حتى الآن
              </p>
              <p className="text-xs text-[#687576] mt-1">
                ستصلك إشعارات هنا فور ظهور نتائج تحاليلك
              </p>
            </div>
          </div>
        ) : (
          <>
            <NotificationsList notifications={notifications} />
            {totalPages > 1 ? (
              <RequestsPagination
                currentPage={currentPage}
                totalPages={totalPages}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
