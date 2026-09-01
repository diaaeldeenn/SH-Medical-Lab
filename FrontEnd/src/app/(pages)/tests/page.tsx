import { getServerSession } from "next-auth";
import { FlaskConical } from "lucide-react";
import { authOptions } from "@/lib/nextAuth/auth";
import { getTests } from "@/service/test.api";
import { TestI } from "@/interfaces/test.interface";
import TestsFilters from "@/components/tests/TestsFilters";
import TestsGrid from "@/components/tests/TestsGrid";
import RequestsPagination from "@/components/home/RequestsPagination";

const LIMIT = 12;

export default async function TestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  const isSpecialist = session?.user.role === "SPECIALIST";

  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const search = params.search ?? "";
  const category = params.category ?? "";

  const res = await getTests(
    currentPage,
    LIMIT,
    search || undefined,
    category || undefined,
  ).catch(() => null);

  const tests: TestI[] = res?.data?.data ?? [];
  const totalPages: number = res?.data?.meta?.totalPages ?? 1;
  const categories = Array.from(
    new Set(tests.map((test) => test.category).filter(Boolean)),
  );

  return (
    <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
      <div className="border-b border-[#D9E1E0] bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-[#5E9C91]" />
          <h1 className="text-xl font-bold text-[#20292A]">التحاليل المتاحة</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <TestsFilters
          initialSearch={search}
          initialCategory={category}
          categories={categories}
        />
        <TestsGrid tests={tests} isSpecialist={!!isSpecialist} />
        {totalPages > 1 && (
          <RequestsPagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
}
