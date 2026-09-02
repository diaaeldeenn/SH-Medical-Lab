import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { FlaskConical, Plus } from "lucide-react";
import { authOptions } from "@/lib/nextAuth/auth";
import { getMyRequest } from "@/action/request.action";
import RequestsPagination from "@/components/home/RequestsPagination";
import { RequestsList } from "@/components/request/RequestsList";
import RequestsTransition from "@/components/ui/RequestsTransition";

const LIMIT = 10;

export default async function Requests({
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

  const response = await getMyRequest(currentPage, LIMIT);
  const requests = response.data.data;
  const totalPages = response.data.meta.totalPages;

  return (
    <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#20292A]">طلباتي</h1>
            <p className="text-sm text-[#687576] mt-1">
              متابعة طلبات التحاليل الخاصة بك ونتائجها
            </p>
          </div>
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            طلب جديد
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white border border-dashed border-[#D9E1E0] rounded-xl px-6 py-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4F7F6] flex items-center justify-center mx-auto">
              <FlaskConical className="w-5 h-5 text-[#5E9C91]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#20292A]">
                لا توجد طلبات حتى الآن
              </p>
              <p className="text-xs text-[#687576] mt-1">
                ابدأ بحجز أول تحليل لك الآن
              </p>
            </div>
            <Link
              href="/requests/new"
              className="inline-flex items-center gap-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              ابدأ بطلبك الأول
            </Link>
          </div>
        ) : (
          <>
            <RequestsTransition>
              <RequestsList requests={requests} />
            </RequestsTransition>

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
