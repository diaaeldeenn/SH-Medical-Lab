"use client";

import { Pencil, Trash2, Droplet, TestTube2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TestI } from "@/interfaces/test.interface";

export default function TestCard({
  test,
  isSpecialist,
  onEdit,
  onDelete,
}: {
  test: TestI;
  isSpecialist: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="border border-[#D9E1E0] bg-white rounded-xl p-4 flex flex-col gap-3 hover:border-[#5E9C91] transition-colors h-full">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#20292A] leading-snug">
            {test.nameAr}
          </p>
          <p className="text-xs text-[#687576] mt-0.5" dir="ltr">
            {test.medicalName}
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {test.category}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[10px] text-[#687576]">
          {test.sampleType === "Blood" ? (
            <Droplet className="w-3 h-3 text-[#5E9C91]" />
          ) : (
            <TestTube2 className="w-3 h-3 text-[#5E9C91]" />
          )}
          {test.sampleType === "Blood" ? "عينة دم" : "عينة بول"}
        </span>
        <span className="text-sm font-bold text-[#5E9C91]">
          {test.price} جنيه
        </span>
      </div>

      {isSpecialist && (
        <div className="flex items-center gap-2 pt-2 border-t border-[#D9E1E0] mt-auto">
          <button
            onClick={onEdit}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#263B3D] border border-[#D9E1E0] hover:border-[#263B3D] rounded-lg px-3 py-1.5 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            تعديل
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
