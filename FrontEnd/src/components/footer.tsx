import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Separator } from "./ui/separator";

export default async function Footer() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role === "PATIENT") {
    return (
      <>
        <footer className="bg-white border-t border-[#D9E1E0]">
          <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24 py-14">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <span className="text-[#5E9C91] font-mono text-xs tracking-widest uppercase">
                  SH Medical Labs
                </span>
                <p className="text-xs text-[#687576] mt-2 max-w-xs leading-relaxed">
                  معمل تحاليل طبية رقمي متكامل يتيح لك متابعة صحتك بسهولة وثقة.
                </p>
              </div>
              <div className="flex flex-wrap gap-10 text-xs text-[#687576]">
                <div className="space-y-2">
                  <p className="font-bold text-[#20292A] text-xs mb-3">
                    الخدمات
                  </p>
                  <Link
                    href="/requests/new"
                    className="block hover:text-[#5E9C91] transition-colors"
                  >
                    حجز تحليل
                  </Link>
                  <Link
                    href="/requests"
                    className="block hover:text-[#5E9C91] transition-colors"
                  >
                    طلباتي
                  </Link>
                  <Link
                    href="/notifications"
                    className="block hover:text-[#5E9C91] transition-colors"
                  >
                    إشعاراتي
                  </Link>
                </div>
              </div>
            </div>
            <Separator className="my-8" />
            <p className="text-[10px] text-[#687576]">
              © {new Date().getFullYear()} SH Medical Labs. جميع الحقوق محفوظة.
            </p>
          </div>
        </footer>
      </>
    );
  }
  if (role === "SPECIALIST") {
  }
  return (
    <>
      <footer className="bg-white border-t border-[#D9E1E0]">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24 py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <span className="text-[#5E9C91] font-mono text-xs tracking-widest uppercase">
                SH Medical Labs
              </span>
              <p className="text-xs text-[#687576] mt-2 max-w-xs leading-relaxed">
                معمل تحاليل طبية رقمي متكامل يتيح لك متابعة صحتك بسهولة وثقة.
              </p>
            </div>
            <div className="flex flex-wrap gap-10 text-xs text-[#687576]">
              <div className="space-y-2">
                <p className="font-bold text-[#20292A] text-xs mb-3">الخدمات</p>
                <Link
                  href="/auth/register"
                  className="block hover:text-[#5E9C91] transition-colors"
                >
                  حجز تحليل
                </Link>
                <Link
                  href="/auth/login"
                  className="block hover:text-[#5E9C91] transition-colors"
                >
                  نتائجي
                </Link>
                <Link
                  href="/auth/login"
                  className="block hover:text-[#5E9C91] transition-colors"
                >
                  إشعاراتي
                </Link>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-[#20292A] text-xs mb-3">الحساب</p>
                <Link
                  href="/auth/register"
                  className="block hover:text-[#5E9C91] transition-colors"
                >
                  تسجيل جديد
                </Link>
                <Link
                  href="/auth/login"
                  className="block hover:text-[#5E9C91] transition-colors"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-[10px] text-[#687576]">
            © {new Date().getFullYear()} SH Medical Labs. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </>
  );
}
