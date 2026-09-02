"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface NavLinksProps {
  role?: string;
  pathname: string;
  className?: string;
}

export default function NavLinks({ role, pathname, className }: NavLinksProps) {
  const roleLinks =
    role === "PATIENT"
      ? [
          { label: "الرئيسية", href: "/" },
          { label: "التحاليل", href: "/tests" },
          { label: "طلباتي", href: "/requests" },
          { label: "احجز موعد", href: "/requests/new" },
          { label: "عن المعمل", href: "/about" },
        ]
      : role === "SPECIALIST"
        ? [
            { label: "الرئيسية", href: "/" },
            { label: "التحاليل", href: "/tests" },
            { label: "إدارة الطلبات", href: "/specialist/requests" },
            { label: "عن المعمل", href: "/about" },
          ]
        : [
            { label: "الرئيسية", href: "/" },
            { label: "التحاليل", href: "/tests" },
            { label: "احجز موعد", href: "/auth/register" },
            { label: "عن المعمل", href: "/about" },
          ];

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