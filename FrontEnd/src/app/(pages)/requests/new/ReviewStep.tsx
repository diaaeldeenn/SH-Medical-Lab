"use client";

import { TestI } from "@/interfaces/test.interface";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { FlaskConical, CalendarDays, Clock, Loader2 } from "lucide-react";

const TIME_LABELS: Record<string, string> = {
  "2:00 PM": "٢:٠٠ مساءً",
  "5:00 PM": "٥:٠٠ مساءً",
  "8:00 PM": "٨:٠٠ مساءً",
};

interface Props {
  selectedTests: TestI[];
  appointmentDate: string;
  appointmentTime: string;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export default function ReviewStep({
  selectedTests,
  appointmentDate,
  appointmentTime,
  isSubmitting,
  onBack,
  onSubmit,
}: Props) {
  const total = selectedTests.reduce((sum, t) => sum + t.price, 0);

  return (
    <div>
      <div className="p-6 border-b border-[#D9E1E0]">
        <h2 className="text-base font-semibold text-[#20292A]">مراجعة الطلب</h2>
        <p className="text-xs text-[#687576] mt-1">تأكد من تفاصيل الطلب قبل الإرسال</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="w-4 h-4 text-[#5E9C91]" />
            <p className="text-xs font-semibold text-[#687576] uppercase tracking-wider">التحاليل المختارة</p>
          </div>
          <div className="border border-[#D9E1E0] divide-y divide-[#D9E1E0] rounded-xl overflow-hidden">
            {selectedTests.map((test) => (
              <div key={test._id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[#20292A]">{test.nameAr}</p>
                  <p className="text-xs text-[#687576]">{test.medicalName}</p>
                </div>
                <p className="text-sm font-semibold text-[#20292A]">{test.price} ج</p>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-[#F4F7F6]">
              <p className="text-sm font-bold text-[#20292A]">الإجمالي</p>
              <p className="text-sm font-bold text-[#5E9C91]">{total} جنيه</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-[#5E9C91]" />
            <p className="text-xs font-semibold text-[#687576] uppercase tracking-wider">موعد الحضور</p>
          </div>
          <div className="border border-[#D9E1E0] px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl">
            <div>
              <p className="text-xs text-[#687576]">التاريخ</p>
              <p className="text-sm font-semibold text-[#20292A] mt-0.5">
                {appointmentDate ? format(new Date(appointmentDate), "EEEE، d MMMM yyyy", { locale: ar }) : ""}
              </p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#D9E1E0]" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5E9C91] shrink-0" />
              <div>
                <p className="text-xs text-[#687576]">موعد الحضور</p>
                <p className="text-sm font-semibold text-[#20292A] mt-0.5">
                  {TIME_LABELS[appointmentTime] || appointmentTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border border-[#D9E1E0] bg-[#F4F7F6] rounded-xl">
          <p className="text-xs text-[#687576] leading-relaxed">
            الدفع يتم نقدًا عند الحضور للمعمل. تأكد من الحضور في الوقت المحدد ومعك بطاقة هويتك.
          </p>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-[#D9E1E0] flex items-center justify-between bg-[#F4F7F6]">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-2.5 border border-[#D9E1E0] text-sm font-medium text-[#687576] hover:border-[#263B3D] hover:text-[#20292A] transition-colors disabled:opacity-40 rounded-xl bg-white"
        >
          السابق
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#5E9C91] text-white text-sm font-medium hover:bg-[#4E887E] transition-colors disabled:opacity-60 flex items-center gap-2 rounded-xl"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "جارٍ الإرسال..." : "تأكيد الطلب"}
        </button>
      </div>
    </div>
  );
}