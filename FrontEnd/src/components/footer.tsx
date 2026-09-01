import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Separator } from "./ui/separator";

const currentYear = new Date().getFullYear();

export default async function Footer() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  const isPatient = role === "PATIENT";
  const isSpecialist = role === "SPECIALIST";

  const serviceLinks = isPatient
    ? [
        { href: "/requests/new", label: "حجز تحليل" },
        { href: "/requests", label: "طلباتي" },
        { href: "/notifications", label: "إشعاراتي" },
      ]
    : isSpecialist
      ? [{ href: "/specialist/requests", label: "طلبات التحاليل" }]
      : [
          { href: "/auth/register", label: "حجز تحليل" },
          { href: "/auth/login", label: "إشعاراتي" },
        ];

  const accountLinks = isPatient
    ? [
        { href: "/profile", label: "الملف الشخصي" },
        { href: "/notifications", label: "الإشعارات" },
      ]
    : isSpecialist
      ? [{ href: "/profile", label: "الملف الشخصي" }]
      : [
          { href: "/auth/register", label: "تسجيل جديد" },
          { href: "/auth/login", label: "تسجيل الدخول" },
        ];

  return (
    <footer dir="rtl" className="bg-white border-t border-[#D9E1E0]">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24 py-12 sm:py-14">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
          <div className="max-w-sm">
            <span className="text-[#5E9C91] font-mono text-xs tracking-widest uppercase">
              SH Medical Labs
            </span>

            <h2 className="mt-3 text-base font-bold text-[#20292A]">
              تحاليلك الطبية بسهولة وثقة
            </h2>

            <p className="text-xs text-[#687576] mt-2 max-w-xs leading-6">
              معمل تحاليل طبية رقمي يتيح لك إدارة طلبات التحاليل ومتابعة نتائجك
              بسهولة وأمان.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-8 text-xs text-[#687576]">
            <div className="min-w-28">
              <p className="font-bold text-[#20292A] text-xs mb-4">الخدمات</p>

              <div className="space-y-3">
                {serviceLinks.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="block hover:text-[#5E9C91] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="min-w-28">
              <p className="font-bold text-[#20292A] text-xs mb-4">الحساب</p>

              <div className="space-y-3">
                {accountLinks.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="block hover:text-[#5E9C91] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[10px] text-[#687576]">
            © {currentYear} SH Medical Labs. جميع الحقوق محفوظة.
          </p>

          <p className="text-[10px] text-[#8A9696]">
            رعاية صحية رقمية أبسط وأوضح
          </p>
        </div>
      </div>
    </footer>
  );
}
