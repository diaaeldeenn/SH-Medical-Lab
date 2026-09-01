"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusLabel } from "@/constants/status";

const STATUS_OPTIONS = [
  { value: "", label: "كل الحالات" },
  ...Object.entries(statusLabel).map(([value, label]) => ({ value, label })),
];

export default function SpecialistRequestsFilters({
  initialStatus,
  initialSearchKey,
  initialStartDate,
  initialEndDate,
}: {
  initialStatus: string;
  initialSearchKey: string;
  initialStartDate: string;
  initialEndDate: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [searchKey, setSearchKey] = useState(initialSearchKey);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const navigate = (
    nextStatus: string,
    nextSearchKey: string,
    nextStartDate: string,
    nextEndDate: string,
  ) => {
    const params = new URLSearchParams();
    if (nextStatus) params.set("status", nextStatus);
    if (nextSearchKey) params.set("searchKey", nextSearchKey);
    if (nextStartDate) params.set("startDate", nextStartDate);
    if (nextEndDate) params.set("endDate", nextEndDate);

    const queryString = params.toString();
    router.push(
      queryString
        ? `/specialist/requests?${queryString}`
        : "/specialist/requests",
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(status, searchKey, startDate, endDate);
  };

  const handleClear = () => {
    setStatus("");
    setSearchKey("");
    setStartDate("");
    setEndDate("");
    router.push("/specialist/requests");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#D9E1E0] rounded-lg p-4 space-y-3"
    >
      <div className="flex items-center gap-2 mb-1">
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#5E9C91]" />
        <span className="text-xs font-semibold text-[#20292A]">بحث وفلترة</span>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687576] pointer-events-none z-10" />
        <Input
          type="text"
          value={searchKey}
          onChange={(event) => setSearchKey(event.target.value)}
          placeholder="ابحث باسم المريض أو رقم الطلب..."
          className="w-full pr-9 pl-4 py-2.5 text-sm bg-[#F4F7F6] border-[#D9E1E0] focus-visible:ring-[#5E9C91]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          value={status}
          onValueChange={(value) => setStatus(value ?? "")}
        >
          <SelectTrigger className="w-full bg-[#F4F7F6] border-[#D9E1E0] text-sm text-[#20292A] focus:ring-[#5E9C91]">
            <SelectValue placeholder="اختر الحالة" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          className="bg-[#F4F7F6] border-[#D9E1E0] text-sm text-[#20292A] focus-visible:ring-[#5E9C91]"
        />

        <Input
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          className="bg-[#F4F7F6] border-[#D9E1E0] text-sm text-[#20292A] focus-visible:ring-[#5E9C91]"
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button
          type="submit"
          className="px-5 py-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium rounded-lg"
        >
          بحث
        </Button>

        <Button
          type="button"
          onClick={handleClear}
          className="px-5 py-2 border border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 hover:text-red-700 text-xs font-medium rounded-lg transition-colors"
        >
          مسح
        </Button>
      </div>
    </form>
  );
}
