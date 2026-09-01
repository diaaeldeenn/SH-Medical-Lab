import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Microscope,
  CalendarDays,
  Users,
  ChevronLeft,
} from "lucide-react";
import { authOptions } from "@/lib/nextAuth/auth";
import { getAllRequest } from "@/action/request.action";
import { RequestI } from "@/interfaces/request.interface";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AnimatedSection, {
  AnimatedItem,
} from "@/components/home/AnimatedSection";
import RequestsPagination from "@/components/home/RequestsPagination";
import { statusLabel, statusVariant } from "@/constants/status";
import SpecialistRequestsFilters from "@/components/specialist/SpecialistRequestsFilters";

const LIMIT = 12;

export default async function SpecialistRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    searchKey?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SPECIALIST") redirect("/");

  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const status = params.status ?? "";
  const searchKey = params.searchKey ?? "";
  const startDate = params.startDate ?? "";
  const endDate = params.endDate ?? "";

  const res = await getAllRequest(
    currentPage,
    LIMIT,
    status || undefined,
    searchKey || undefined,
    startDate || undefined,
    endDate || undefined,
  ).catch(() => null);

  const requests: RequestI[] = res?.data?.data ?? [];
  const totalDocs: number = res?.data?.meta?.totalDocs ?? 0;
  const totalPages: number = Math.ceil(totalDocs / LIMIT);
  const hasFilters = !!(status || searchKey || startDate || endDate);

  return (
    <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
      <div className="border-b border-[#D9E1E0] bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-xs font-mono text-[#5E9C91] tracking-wider mb-1">
            لوحة الأخصائي
          </p>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-[#20292A]">إدارة الطلبات</h1>
            {totalDocs > 0 && (
              <span className="text-xs font-mono text-[#687576] bg-[#F4F7F6] border border-[#D9E1E0] px-2.5 py-1 rounded-lg">
                {totalDocs} طلب
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <SpecialistRequestsFilters
          initialStatus={status}
          initialSearchKey={searchKey}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />

        <AnimatedSection>
          <AnimatedItem>
            <div className="bg-white border border-[#D9E1E0] rounded-lg overflow-hidden">
              {requests.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-3">
                  <Microscope className="w-7 h-7 text-[#D9E1E0]" />
                  <p className="text-sm text-[#687576]">
                    {hasFilters
                      ? "لا توجد نتائج مطابقة للفلتر"
                      : "لا توجد طلبات حالياً"}
                  </p>
                  {hasFilters && (
                    <Link
                      href="/specialist/requests"
                      className="text-xs text-[#5E9C91] hover:text-[#4E887E] transition-colors"
                    >
                      مسح الفلاتر
                    </Link>
                  )}
                </div>
              ) : (
                <div>
                  <div className="px-5 py-3 flex items-center gap-2 bg-[#F4F7F6] border-b border-[#D9E1E0]">
                    <Users className="w-3.5 h-3.5 text-[#687576]" />
                    <p className="text-xs font-medium text-[#687576]">
                      عرض {requests.length} من {totalDocs}
                    </p>
                  </div>

                  {requests.map((request, index) => (
                    <div key={request._id}>
                      <Link
                        href={`/specialist/requests/${request._id}`}
                        className="flex items-center justify-between px-5 py-4 hover:bg-[#F4F7F6] transition-colors group"
                      >
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-[#687576]">
                              {request.requestNumber}
                            </span>
                            <Badge
                              variant={
                                statusVariant[request.status] ?? "outline"
                              }
                            >
                              {statusLabel[request.status] ?? request.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-semibold text-[#20292A] truncate">
                            {request.patient?.name}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-[#687576]">
                            <span className="flex items-center gap-1">
                              <Microscope className="w-3 h-3 text-[#5E9C91]" />
                              {request.tests.length}{" "}
                              {request.tests.length === 1 ? "تحليل" : "تحاليل"}
                            </span>
                            {request.appointment?.appointmentDate && (
                              <span className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3 text-[#5E9C91]" />
                                {new Date(
                                  request.appointment.appointmentDate,
                                ).toLocaleDateString("ar-EG", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                                {request.appointment.appointmentTime && (
                                  <span
                                    dir="ltr"
                                    className="font-medium text-[#20292A]"
                                  >
                                    {" "}
                                    {request.appointment.appointmentTime}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-[#D9E1E0] group-hover:text-[#5E9C91] transition-colors shrink-0 mr-3" />
                      </Link>
                      {index < requests.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedItem>

          {totalPages > 1 && (
            <AnimatedItem>
              <RequestsPagination
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </AnimatedItem>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
