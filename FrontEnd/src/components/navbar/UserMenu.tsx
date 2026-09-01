"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserRound, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const { data: session } = useSession();
  const user = session?.user;

  const logout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="w-9 h-9 rounded-full border border-[#D9E1E0] bg-[#F4F7F6] hover:border-[#5E9C91] hover:bg-[#EDF3F1] flex items-center justify-center text-[#263B3D] transition-colors outline-none cursor-pointer"
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
            <UserRound size={16} className="text-[#5E9C91]" strokeWidth={1.8} />
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
  );
}
