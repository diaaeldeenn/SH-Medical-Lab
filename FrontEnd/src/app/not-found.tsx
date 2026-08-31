import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#F4F7F6] flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="bg-white border border-[#D9E1E0] rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-sm">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F4F7F6] border border-[#D9E1E0] flex items-center justify-center text-[#263B3D]">
            <FileQuestion className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#5E9C91] tracking-wider uppercase">
            خطأ 404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#20292A]">
            الصفحة غير موجودة
          </h1>
          <p className="text-xs sm:text-sm text-[#687576] leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها أو حذفها.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs sm:text-sm font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>العودة إلى الرئيسية</span>
          </Link>
        </div>
        <p className="text-[10px] text-[#687576]">
          SHLab — نظام إدارة معمل التحاليل الطبية
        </p>
      </div>
    </div>
  );
}
