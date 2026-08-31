"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  FlaskConical,
  Menu,
  X,
  ChevronDown,
  TestTube2,
  CalendarCheck,
  FileText,
  Info,
  UserRound,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavLink {
  label: string;
  href?: string;
  anchor?: string;
  children?: {
    label: string;
    href?: string;
    anchor?: string;
    icon: React.ElementType;
    desc: string;
  }[];
}

const NAV_LINKS: NavLink[] = [
  {
    label: "التحاليل",
    children: [
      {
        label: "كل التحاليل",
        anchor: "#tests",
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
    ],
  },
  {
    label: "كيف يعمل؟",
    anchor: "#how",
  },
  {
    label: "عن المعمل",
    anchor: "#about",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  const logout = () => {
    signOut({
      callbackUrl: "/auth/login",
    });
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      dir="rtl"
      className={cn(
        "sticky top-0 z-50 bg-white border-b border-[#D9E1E0] transition-shadow duration-200",
        scrolled && "shadow-sm",
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#263B3D] flex items-center justify-center group-hover:bg-[#1E3032] transition-colors">
            <FlaskConical
              size={16}
              className="text-[#5E9C91]"
              strokeWidth={2}
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[#263B3D] text-base font-bold tracking-tight">
              SHLab
            </span>

            <span className="text-[10px] text-[#687576] font-normal hidden sm:block">
              SH Medical Labs
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            if (link.children) {
              return (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium text-[#687576]",
                      "hover:text-[#263B3D] transition-colors py-2 px-2",
                      "outline-none",
                    )}
                  >
                    {link.label}

                    <ChevronDown size={14} />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    className="w-72 p-1.5 rounded-xl border border-[#D9E1E0] bg-white shadow-lg"
                  >
                    {link.children.map(
                      ({ label, href, anchor, icon: Icon, desc }) => (
                        <DropdownMenuItem
                          key={label}
                          className="p-0 focus:bg-transparent"
                        >
                          {anchor ? (
                            <a
                              href={anchor}
                              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F4F7F6] transition-colors group cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#F4F7F6] group-hover:bg-white flex items-center justify-center shrink-0 mt-0.5 transition-colors border border-[#D9E1E0]">
                                <Icon
                                  size={15}
                                  className="text-[#5E9C91]"
                                  strokeWidth={1.8}
                                />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-[#20292A]">
                                  {label}
                                </p>

                                <p className="text-xs text-[#687576] mt-0.5 leading-snug">
                                  {desc}
                                </p>
                              </div>
                            </a>
                          ) : (
                            <Link
                              href={href!}
                              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F4F7F6] transition-colors group cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#F4F7F6] group-hover:bg-white flex items-center justify-center shrink-0 mt-0.5 transition-colors border border-[#D9E1E0]">
                                <Icon
                                  size={15}
                                  className="text-[#5E9C91]"
                                  strokeWidth={1.8}
                                />
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
                          )}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            if (link.anchor) {
              return (
                <a
                  key={link.label}
                  href={link.anchor}
                  className="text-sm font-medium text-[#687576] hover:text-[#263B3D] transition-colors py-2 px-2"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href!}
                className="text-sm font-medium text-[#687576] hover:text-[#263B3D] transition-colors py-2 px-2"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {status === "loading" ? (
            <div className="w-9 h-9 rounded-full bg-[#F4F7F6] animate-pulse" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "w-9 h-9 rounded-full",
                  "border border-[#D9E1E0]",
                  "bg-[#F4F7F6]",
                  "hover:border-[#5E9C91]",
                  "hover:bg-[#EDF3F1]",
                  "flex items-center justify-center",
                  "text-[#263B3D]",
                  "transition-colors",
                  "outline-none",
                  "cursor-pointer",
                )}
                aria-label="قائمة المستخدم"
              >
                <UserRound size={17} strokeWidth={1.8} />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="w-56 p-1.5 rounded-xl border border-[#D9E1E0] bg-white shadow-lg"
              >
                <div className="px-3 py-2.5 border-b border-[#D9E1E0] mb-1">
                  <p className="text-sm font-semibold text-[#20292A] truncate">
                    {user?.name || "المستخدم"}
                  </p>

                  {user?.email && (
                    <p className="text-xs text-[#687576] truncate mt-0.5">
                      {user.email}
                    </p>
                  )}
                </div>

                <DropdownMenuItem className="p-0 focus:bg-transparent">
                  <Link
                    href="/profile"
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-[#F4F7F6] transition-colors text-sm text-[#263B3D]"
                  >
                    <UserRound
                      size={16}
                      className="text-[#5E9C91]"
                      strokeWidth={1.8}
                    />

                    <span>الملف الشخصي</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-0 focus:bg-transparent">
                  <button
                    type="button"
                    onClick={logout}
                    className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-sm text-red-600"
                  >
                    <LogOut size={16} strokeWidth={1.8} />

                    <span>تسجيل الخروج</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-[#263B3D] hover:text-[#5E9C91] px-3 py-2 transition-colors"
              >
                تسجيل الدخول
              </Link>

              <Link
                href="/auth/register"
                className="text-sm font-medium bg-[#263B3D] hover:bg-[#1E3032] text-white px-4 py-2 rounded-lg transition-colors"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="md:hidden w-9 h-9 rounded-lg border-[#D9E1E0] hover:border-[#5E9C91] text-[#263B3D]"
                aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
              />
            }
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-sm p-0 border-[#D9E1E0]"
            dir="rtl"
          >
            <SheetHeader className="px-4 pt-5 pb-4 border-b border-[#D9E1E0]">
              <SheetTitle className="text-right text-[#263B3D]">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#263B3D] flex items-center justify-center">
                    <FlaskConical
                      size={16}
                      className="text-[#5E9C91]"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="flex flex-col leading-none">
                    <span className="text-[#263B3D] text-base font-bold tracking-tight">
                      SHLab
                    </span>

                    <span className="text-[10px] text-[#687576] font-normal">
                      SH Medical Labs
                    </span>
                  </div>
                </Link>
              </SheetTitle>
            </SheetHeader>

            <nav className="px-4 py-4 flex flex-col gap-1">
              <a
                href="#tests"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
              >
                <TestTube2
                  size={16}
                  className="text-[#5E9C91]"
                  strokeWidth={1.8}
                />

                <span className="text-sm font-medium text-[#20292A]">
                  التحاليل المتاحة
                </span>
              </a>

              <a
                href="#how"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
              >
                <CalendarCheck
                  size={16}
                  className="text-[#5E9C91]"
                  strokeWidth={1.8}
                />

                <span className="text-sm font-medium text-[#20292A]">
                  كيف يعمل؟
                </span>
              </a>

              <a
                href="#about"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
              >
                <Info size={16} className="text-[#5E9C91]" strokeWidth={1.8} />

                <span className="text-sm font-medium text-[#20292A]">
                  عن المعمل
                </span>
              </a>

              <div className="border-t border-[#D9E1E0] my-2" />

              {status === "loading" ? (
                <div className="h-16 rounded-lg bg-[#F4F7F6] animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#F4F7F6]">
                    <div className="w-10 h-10 rounded-full border border-[#D9E1E0] bg-white flex items-center justify-center text-[#263B3D]">
                      <UserRound size={18} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#20292A] truncate">
                        {user?.name || "المستخدم"}
                      </p>

                      {user?.email && (
                        <p className="text-xs text-[#687576] truncate mt-0.5">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
                  >
                    <UserRound
                      size={16}
                      className="text-[#5E9C91]"
                      strokeWidth={1.8}
                    />

                    <span className="text-sm font-medium text-[#263B3D]">
                      الملف الشخصي
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut size={16} strokeWidth={1.8} />

                    <span className="text-sm font-medium">تسجيل الخروج</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center py-2.5 rounded-lg border border-[#D9E1E0] hover:border-[#5E9C91] text-sm font-medium text-[#263B3D] transition-colors"
                  >
                    تسجيل الدخول
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center py-2.5 rounded-lg bg-[#263B3D] hover:bg-[#1E3032] text-sm font-medium text-white transition-colors"
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
