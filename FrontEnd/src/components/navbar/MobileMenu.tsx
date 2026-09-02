"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  TestTube2,
  Info,
  UserRound,
  LogOut,
  ClipboardList,
  Bell,
  Microscope,
  Home,
  CalendarCheck,
} from "lucide-react";

interface MobileMenuProps {
  onNavigate: () => void;
}

export default function MobileMenu({ onNavigate }: MobileMenuProps) {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const role = session?.user.role;
  const user = session?.user;

  const logout = () => {
    onNavigate();
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <nav className="px-4 flex flex-col gap-1">
      {!isAuthenticated && (
        <>
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <Home size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">
              الرئيسية
            </span>
          </Link>

          <Link
            href="/tests"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <TestTube2 size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">
              التحاليل
            </span>
          </Link>

          <Link
            href="/auth/register"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <CalendarCheck size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">
              احجز موعد
            </span>
          </Link>

          <Link
            href="/about"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <Info size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">
              عن المعمل
            </span>
          </Link>
        </>
      )}

      {role === "PATIENT" && (
        <>
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <Home size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">الرئيسية</span>
          </Link>

          <Link
            href="/tests"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <TestTube2 size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">التحاليل</span>
          </Link>

          <Link
            href="/requests"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <ClipboardList
              size={16}
              className="text-[#5E9C91]"
              strokeWidth={1.8}
            />
            <span className="text-sm font-medium text-[#20292A]">طلباتي</span>
          </Link>

          <Link
            href="/requests/new"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <CalendarCheck
              size={16}
              className="text-[#5E9C91]"
              strokeWidth={1.8}
            />
            <span className="text-sm font-medium text-[#20292A]">احجز موعد</span>
          </Link>

          <Link
            href="/about"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <Info size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">عن المعمل</span>
          </Link>

          <Link
            href="/notifications"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <Bell size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">
              الإشعارات
            </span>
          </Link>
        </>
      )}

      {role === "SPECIALIST" && (
        <>
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <Home size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">الرئيسية</span>
          </Link>

          <Link
            href="/tests"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <TestTube2 size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">التحاليل</span>
          </Link>

          <Link
            href="/specialist/requests"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <Microscope
              size={16}
              className="text-[#5E9C91]"
              strokeWidth={1.8}
            />
            <span className="text-sm font-medium text-[#20292A]">
              إدارة الطلبات
            </span>
          </Link>

          <Link
            href="/about"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <Info size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#20292A]">عن المعمل</span>
          </Link>
        </>
      )}

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
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F4F7F6] transition-colors"
          >
            <UserRound size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#263B3D]">
              الملف الشخصي
            </span>
          </Link>

          <button
            type="button"
            onClick={logout}
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
            onClick={onNavigate}
            className="w-full flex items-center justify-center py-2.5 rounded-lg border border-[#D9E1E0] hover:border-[#5E9C91] text-sm font-medium text-[#263B3D] transition-colors"
          >
            تسجيل الدخول
          </Link>

          <Link
            href="/auth/register"
            onClick={onNavigate}
            className="w-full flex items-center justify-center py-2.5 rounded-lg bg-[#263B3D] hover:bg-[#1E3032] text-sm font-medium text-white transition-colors"
          >
            إنشاء حساب
          </Link>
        </>
      )}
    </nav>
  );
}