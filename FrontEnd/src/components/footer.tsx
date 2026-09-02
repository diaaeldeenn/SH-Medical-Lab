import { authOptions } from "@/lib/nextAuth/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const currentYear = new Date().getFullYear();

export default async function Footer() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  const isPatient = role === "PATIENT";
  const isSpecialist = role === "SPECIALIST";

  const serviceLinks = isPatient
    ? [
        { href: "/", label: "الرئيسية" },
        { href: "/tests", label: "التحاليل" },
        { href: "/requests/new", label: "حجز تحليل" },
        { href: "/requests", label: "طلباتي" },
        { href: "/about", label: "عن المعمل" },
      ]
    : isSpecialist
      ? [
          { href: "/", label: "الرئيسية" },
          { href: "/tests", label: "التحاليل" },
          { href: "/specialist/requests", label: "إدارة الطلبات" },
          { href: "/about", label: "عن المعمل" },
        ]
      : [
          { href: "/", label: "الرئيسية" },
          { href: "/tests", label: "التحاليل" },
          { href: "/auth/register", label: "حجز موعد" },
          { href: "/about", label: "عن المعمل" },
        ];

  const accountLinks = isPatient
    ? [
        { href: "/profile", label: "الملف الشخصي" },
        { href: "/notifications", label: "الإشعارات" },
      ]
    : isSpecialist
      ? [{ href: "/profile", label: "الملف الشخصي" }]
      : [
          { href: "/auth/login", label: "تسجيل الدخول" },
          { href: "/auth/register", label: "إنشاء حساب" },
        ];

  const socialLinks = [
    {
      href: "https://www.facebook.com/diaaeldeenn",
      label: "Facebook",
      icon: FaFacebookF,
    },
    {
      href: "https://www.linkedin.com/in/diaaelseady",
      label: "LinkedIn",
      icon: FaLinkedinIn,
    },
    {
      href: "https://wa.me/201278396490",
      label: "WhatsApp",
      icon: FaWhatsapp,
    },
    {
      href: "mailto:diaaelseady@gmail.com",
      label: "Email",
      icon: HiOutlineMail,
    },
  ];

  return (
    <footer
      dir="rtl"
      className="bg-[#F8FAFA] border-t border-[#D9E1E0] text-[#20292A]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          <div className="lg:col-span-5">
            <div className="mb-2">
              <Image
                src="/logo.png"
                alt="SH Medical Labs Logo"
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-full"
              />
            </div>

            <span className="inline-block px-3 py-1 my-3 rounded-md bg-[#5E9C91]/10 text-[#5E9C91] font-mono text-xs tracking-wider uppercase font-semibold">
              SH Medical Labs
            </span>

            <h2 className="text-lg font-bold text-[#20292A] leading-snug">
              تحاليلك الطبية الرقمية بسهولة وثقة تامة
            </h2>

            <p className="text-xs text-[#687576] max-w-sm leading-6">
              معمل تحاليل طبية ذكي يتيح لك إدارة طلباتك، حجز مواعيدك، ومتابعة
              نتائجك الصحية بكل أمان ويسر.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white border border-[#D9E1E0] flex items-center justify-center text-[#687576] hover:bg-[#5E9C91] hover:text-white hover:border-[#5E9C91] transition-all shadow-sm"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-[#20292A] text-xs uppercase tracking-wider mb-4">
                الروابط السريعة
              </p>
              <div className="space-y-2.5">
                {serviceLinks.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="block text-xs text-[#687576] hover:text-[#5E9C91] transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-[#20292A] text-xs uppercase tracking-wider mb-4">
                حسابي
              </p>
              <div className="space-y-2.5">
                {accountLinks.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="block text-xs text-[#687576] hover:text-[#5E9C91] transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-[#D9E1E0]" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <p className="text-[11px] text-[#687576]">
            © {currentYear} SH Medical Labs. جميع الحقوق محفوظة.
          </p>

          <p className="text-[11px] text-[#687576] flex items-center justify-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[#263B3D] bg-white px-2.5 py-1 rounded-md border border-[#D9E1E0] shadow-2xs tracking-wide">
              Where SH beats to heal the heart
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
