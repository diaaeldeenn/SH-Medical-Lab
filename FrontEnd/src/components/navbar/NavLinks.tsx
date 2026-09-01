"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronDown, TestTube2, CalendarCheck, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLinksProps {
  role?: string;
  pathname: string;
  className?: string;
}

const GUEST_TESTS_MENU = [
  {
    label: "كل التحاليل",
    href: "/tests",
    icon: TestTube2,
    desc: "استعرض جميع التحاليل المتاحة وأسعارها",
  },
  {
    label: "احجز موعد",
    href: "/auth/register",
    icon: CalendarCheck,
    desc: "أنشئ حسابك واحجز موعدك الآن",
  },
  {
    label: "نتائجك",
    href: "/auth/login",
    icon: FileText,
    desc: "سجّل دخولك لمتابعة نتائج تحاليلك",
  },
];

export default function NavLinks({ role, pathname, className }: NavLinksProps) {
  const roleLinks =
    role === "PATIENT"
      ? [
          { label: "التحاليل", href: "/tests" },
          { label: "طلباتي", href: "/requests" },
        ]
      : role === "SPECIALIST"
        ? [
            { label: "التحاليل", href: "/tests" },
            { label: "إدارة الطلبات", href: "/specialist/requests" },
          ]
        : null;

  if (roleLinks) {
    return (
      <nav className={cn("items-center gap-1", className)}>
        {roleLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium px-3 py-2 transition-colors",
                isActive
                  ? "text-[#263B3D]"
                  : "text-[#687576] hover:text-[#263B3D]",
              )}
            >
              {link.label}
              {isActive && (
                <motion.span
                  layoutId="navbar-active-underline"
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#5E9C91]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={cn("items-center gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-[#687576] hover:text-[#263B3D] transition-colors py-2 px-2 outline-none">
          التحاليل
          <ChevronDown size={14} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-72 p-1.5 rounded-xl border border-[#D9E1E0] bg-white shadow-lg"
        >
          {GUEST_TESTS_MENU.map(({ label, href, icon: Icon, desc }) => (
            <DropdownMenuItem key={label} className="p-0 focus:bg-transparent">
              <Link
                href={href}
                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F4F7F6] transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F4F7F6] group-hover:bg-white flex items-center justify-center shrink-0 mt-0.5 transition-colors border border-[#D9E1E0]">
                  <Icon size={15} className="text-[#5E9C91]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#20292A]">
                    {label}
                  </p>
                  <p className="text-xs text-[#687576] mt-0.5 leading-snug">
                    {desc}
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/about"
        className={cn(
          "text-sm font-medium px-2 py-2 transition-colors",
          pathname === "/about"
            ? "text-[#263B3D]"
            : "text-[#687576] hover:text-[#263B3D]",
        )}
      >
        عن المعمل
      </Link>
    </nav>
  );
}