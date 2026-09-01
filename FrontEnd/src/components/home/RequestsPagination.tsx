"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface RequestsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function RequestsPagination({
  currentPage,
  totalPages,
}: RequestsPaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const generatePaginationLinks = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis-end", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis-start", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center pt-4" dir="ltr">
      <Pagination>
        <PaginationContent className="gap-1.5 flex-wrap">
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(currentPage - 1)}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              className={
                currentPage <= 1
                  ? "pointer-events-none opacity-40 border border-[#D9E1E0] text-[#687576]"
                  : "border border-[#D9E1E0] text-[#687576] hover:border-[#5E9C91] hover:text-[#5E9C91] transition-colors rounded-lg"
              }
              onClick={(e) => {
                if (currentPage <= 1) e.preventDefault();
              }}
            />
          </PaginationItem>

          {generatePaginationLinks().map((page, index) => {
            if (typeof page === "string") {
              return (
                <PaginationItem key={`${page}-${index}`}>
                  <PaginationEllipsis className="text-[#687576]" />
                </PaginationItem>
              );
            }

            const isActive = page === currentPage;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={createPageUrl(page)}
                  isActive={isActive}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#263B3D] text-white border border-[#263B3D] hover:bg-[#263B3D]/90 hover:text-white"
                      : "border border-[#D9E1E0] text-[#687576] hover:border-[#5E9C91] hover:text-[#5E9C91]"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href={createPageUrl(currentPage + 1)}
              aria-disabled={currentPage >= totalPages}
              tabIndex={currentPage >= totalPages ? -1 : undefined}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-40 border border-[#D9E1E0] text-[#687576]"
                  : "border border-[#D9E1E0] text-[#687576] hover:border-[#5E9C91] hover:text-[#5E9C91] transition-colors rounded-lg"
              }
              onClick={(e) => {
                if (currentPage >= totalPages) e.preventDefault();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}