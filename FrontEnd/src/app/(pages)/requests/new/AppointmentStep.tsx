"use client";

import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay } from "date-fns";
import { ar } from "date-fns/locale";
import { Clock } from "lucide-react";

const TIME_SLOTS = [
  { value: "2:00 PM", label: "٢:٠٠ مساءً" },
  { value: "5:00 PM", label: "٥:٠٠ مساءً" },
  { value: "8:00 PM", label: "٨:٠٠ مساءً" },
];

interface Props {
  appointmentDate: string;
  appointmentTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function AppointmentStep({
  appointmentDate,
  appointmentTime,
  onDateChange,
  onTimeChange,
  onBack,
  onNext,
}: Props) {
  const selectedDate = appointmentDate ? new Date(appointmentDate) : undefined;

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;
    onDateChange(format(day, "yyyy-MM-dd"));
    onTimeChange("");
  };

  const isDisabled = (day: Date) =>
    isBefore(startOfDay(day), startOfDay(new Date()));

  const canProceed = !!appointmentDate && !!appointmentTime;

  return (
    <div>
      <div className="p-6 border-b border-[#D9E1E0]">
        <h2 className="text-base font-semibold text-[#20292A]">
          اختر موعد الحضور
        </h2>
        <p className="text-xs text-[#687576] mt-1">
          تأكد من قدرتك على الحضور في الوقت المحدد
        </p>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#687576] mb-3 uppercase tracking-wider">
              التاريخ
            </p>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDaySelect}
              disabled={isDisabled}
              locale={ar}
              dir="rtl"
              classNames={{
                months: "flex flex-col",
                month: "space-y-3",
                month_caption:
                  "flex justify-center pt-1 relative items-center text-sm font-medium text-[#20292A]",
                caption_label: "text-sm font-semibold text-[#20292A]",
                nav: "space-x-1 flex items-center",
                button_previous:
                  "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border border-[#D9E1E0] flex items-center justify-center rounded-lg",
                button_next:
                  "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border border-[#D9E1E0] flex items-center justify-center rounded-lg",
                month_grid: "w-full border-collapse",
                weekdays: "flex",
                weekday:
                  "text-[#687576] flex-1 font-normal text-[0.8rem] text-center",
                week: "flex w-full mt-1",
                day: "h-9 w-9 text-center text-sm relative focus-within:relative focus-within:z-20 p-0",
                day_button:
                  "h-9 w-9 p-0 font-normal text-[#20292A] hover:bg-[#F4F7F6] transition-colors rounded-lg w-full flex items-center justify-center",
                selected:
                  "bg-[#263B3D] text-white hover:bg-[#1E3032] hover:text-white focus:bg-[#263B3D] focus:text-white rounded-lg",
                today: "bg-[#5E9C91]/15 text-[#5E9C91] font-bold rounded-lg",
                outside: "text-[#687576] opacity-100",
                disabled:
                  "text-[#D9E1E0] opacity-50 cursor-not-allowed hover:bg-transparent",
              }}
            />
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold text-[#687576] mb-3 uppercase tracking-wider">
              الوقت
            </p>
            {!appointmentDate ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2 border border-dashed border-[#D9E1E0] rounded-xl">
                <Clock className="w-5 h-5 text-[#D9E1E0]" />
                <p className="text-xs text-[#687576]">اختر التاريخ أولاً</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => onTimeChange(slot.value)}
                    className={`w-full py-3.5 px-4 border text-sm font-medium transition-all text-right flex items-center justify-between rounded-xl ${
                      appointmentTime === slot.value
                        ? "bg-[#263B3D] text-white border-[#263B3D]"
                        : "bg-white border-[#D9E1E0] text-[#20292A] hover:border-[#263B3D]"
                    }`}
                  >
                    <span>{slot.label}</span>
                    {appointmentTime === slot.value && (
                      <span className="text-xs opacity-70">✓ محدد</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {appointmentDate && appointmentTime && (
              <div className="mt-4 p-3 bg-[#5E9C91]/8 border border-[#5E9C91]/30 rounded-xl">
                <p className="text-xs text-[#687576]">موعدك</p>
                <p className="text-sm font-bold text-[#20292A] mt-0.5">
                  {format(new Date(appointmentDate), "EEEE، d MMMM yyyy", {
                    locale: ar,
                  })}
                </p>
                <p className="text-sm text-[#5E9C91] font-medium">
                  {TIME_SLOTS.find((s) => s.value === appointmentTime)?.label}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-[#D9E1E0] flex items-center justify-between bg-[#F4F7F6]">
        <button
          onClick={onBack}
          className="px-5 py-2.5 border border-[#D9E1E0] text-sm font-medium text-[#687576] hover:border-[#263B3D] hover:text-[#20292A] transition-colors rounded-xl bg-white"
        >
          السابق
        </button>
        <button
          disabled={!canProceed}
          onClick={onNext}
          className="px-5 py-2.5 bg-[#263B3D] text-white text-sm font-medium disabled:opacity-40 hover:bg-[#1E3032] transition-colors rounded-xl"
        >
          مراجعة الطلب
        </button>
      </div>
    </div>
  );
}
