"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavLinks from "@/components/navbar/NavLinks";
import UserMenu from "@/components/navbar/UserMenu";
import NotificationBell from "@/components/navbar/NotificationBell";
import MobileMenu from "@/components/navbar/MobileMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isAuthenticated = status === "authenticated";
  const role = session?.user.role;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 bg-white border-b border-[#D9E1E0] shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
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

        <NavLinks role={role} pathname={pathname} className="hidden md:flex" />

        <div className="hidden md:flex items-center gap-2">
          {status === "loading" ? (
            <div className="w-9 h-9 rounded-full bg-[#F4F7F6] animate-pulse" />
          ) : isAuthenticated ? (
            <>
              {role === "PATIENT" && <NotificationBell />}
              <UserMenu />
            </>
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

        <div className="flex md:hidden items-center gap-1.5">
          {isAuthenticated && role === "PATIENT" && <NotificationBell />}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="w-9 h-9 rounded-lg border-[#D9E1E0] hover:border-[#5E9C91] text-[#263B3D]"
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

              <MobileMenu onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}