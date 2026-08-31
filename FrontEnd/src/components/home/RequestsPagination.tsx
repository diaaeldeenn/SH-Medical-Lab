"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RequestsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function RequestsPagination({ currentPage, totalPages }: RequestsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goTo = (page: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", page.toString());
    router.push(`?${p.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2" dir="ltr">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D9E1E0] text-[#687576] hover:border-[#5E9C91] hover:text-[#5E9C91] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goTo(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
            page === currentPage
              ? "bg-[#263B3D] text-white border border-[#263B3D]"
              : "border border-[#D9E1E0] text-[#687576] hover:border-[#5E9C91] hover:text-[#5E9C91]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D9E1E0] text-[#687576] hover:border-[#5E9C91] hover:text-[#5E9C91] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}