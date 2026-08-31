import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white border border-[#D9E1E0] rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-sm">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-[#F4F7F6] flex items-center justify-center text-[#5E9C91]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[#20292A]">
            جاري تحميل البيانات...
          </h2>
          <p className="text-xs text-[#687576]">
            يرجى الانتظار لحظات قليلة لتحضير لوحة التحكم
          </p>
        </div>
      </div>
    </div>
  );
}
