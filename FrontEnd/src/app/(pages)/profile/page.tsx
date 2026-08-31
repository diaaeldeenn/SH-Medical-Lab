"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  User,
  Lock,
  Phone,
  Mail,
  Calendar,
  Venus,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  changePasswordSchema,
  ChangePasswordType,
} from "@/validation/auth.validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/action/auth.action";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (form: ChangePasswordType) => {
    setIsSubmitting(true);
    try {
      await changePassword(form);
      toast.success("تم تغيير كلمة المرور بنجاح");
      reset();
      await signOut({
        callbackUrl: "/auth/login",
      });
    } catch (err: any) {
      toast.error(err.message || "فشل تغيير كلمة المرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] px-4 py-10" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-[#20292A]">الملف الشخصي</h1>
          <p className="text-sm text-[#687576] mt-1">بيانات حسابك في SHLab</p>
        </div>

        <div className="bg-white border border-[#D9E1E0] rounded-xl overflow-hidden">
          <div className="px-6 pt-6 pb-4 flex items-center gap-4 border-b border-[#D9E1E0]">
            <div className="w-12 h-12 rounded-full bg-[#263B3D] flex items-center justify-center shrink-0">
              <User size={22} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-[#20292A]">
                {user?.name || "—"}
              </p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[#F4F7F6] text-[#5E9C91] font-medium border border-[#D9E1E0]">
                {user?.role === "PATIENT"
                  ? "مريض"
                  : user?.role === "SPECIALIST"
                    ? "أخصائي تحاليل"
                    : "—"}
              </span>
            </div>
          </div>

          <div className="px-6 divide-y divide-[#D9E1E0]">
            <div className="flex items-center gap-3 py-4">
              <Phone size={15} className="text-[#5E9C91] shrink-0" />
              <div>
                <p className="text-xs text-[#687576]">رقم الهاتف</p>
                <p className="text-sm font-medium text-[#20292A] mt-0.5">
                  {user?.phone || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-4">
              <Mail size={15} className="text-[#5E9C91] shrink-0" />
              <div>
                <p className="text-xs text-[#687576]">البريد الإلكتروني</p>
                <p className="text-sm font-medium text-[#20292A] mt-0.5">
                  {user?.email || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-4">
              <Calendar size={15} className="text-[#5E9C91] shrink-0" />
              <div>
                <p className="text-xs text-[#687576]">تاريخ الميلاد</p>
                <p className="text-sm font-medium text-[#20292A] mt-0.5">
                  {user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-4">
              <Venus size={15} className="text-[#5E9C91] shrink-0" />
              <div>
                <p className="text-xs text-[#687576]">الجنس</p>
                <p className="text-sm font-medium text-[#20292A] mt-0.5">
                  {user?.gender === "MALE"
                    ? "ذكر"
                    : user?.gender === "FEMALE"
                      ? "أنثى"
                      : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#D9E1E0] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D9E1E0] flex items-center gap-3">
            <Lock size={16} className="text-[#5E9C91]" />
            <h2 className="text-sm font-bold text-[#20292A]">
              تغيير كلمة المرور
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-5 space-y-4"
            noValidate
          >
            <div>
              <label className="block text-xs font-medium text-[#687576] mb-1.5">
                كلمة المرور الحالية
              </label>
              <div className="relative">
                <Input
                  {...register("oldPassword")}
                  type={showOld ? "text" : "password"}
                  placeholder="••••••••"
                  dir="rtl"
                  className="w-full h-10 rounded-lg border border-[#D9E1E0] bg-[#F4F7F6] px-4 text-sm text-[#20292A] placeholder:text-[#687576] outline-none focus:border-[#5E9C91] focus:ring-2 focus:ring-[#5E9C91]/10 transition"
                />
                <Button
                  type="button"
                  onClick={() => setShowOld((p) => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#687576] hover:text-[#263B3D] transition"
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.oldPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#687576] mb-1.5">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <Input
                  {...register("newPassword")}
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  dir="rtl"
                  className="w-full h-10 rounded-lg border border-[#D9E1E0] bg-[#F4F7F6] px-4 text-sm text-[#20292A] placeholder:text-[#687576] outline-none focus:border-[#5E9C91] focus:ring-2 focus:ring-[#5E9C91]/10 transition"
                />
                <Button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#687576] hover:text-[#263B3D] transition"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full h-10 rounded-lg bg-[#263B3D] hover:bg-[#1E3032] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition"
              >
                {isSubmitting ? "جارٍ الحفظ..." : "تغيير كلمة المرور"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
