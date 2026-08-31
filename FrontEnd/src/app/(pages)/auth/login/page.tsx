"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, FlaskConical } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { loginSchema, LoginType } from "@/validation/auth.validation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginType) {
    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        phone: data.phone,
        password: data.password,
        redirect: false,
      });

      if (!response?.ok) {
        toast.error(response?.error || "رقم الموبايل أو كلمة السر غير صحيحة");
        return;
      }

      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("حدث خطأ غير متوقع، يرجى المحاولة لاحقاً");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center px-4 py-10"
    >
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <FlaskConical
            className="text-[#5E9C91]"
            size={28}
            strokeWidth={1.8}
          />
          <span className="text-[#263B3D] text-2xl font-bold tracking-tight">
            SHLab
          </span>
        </div>
        <p className="text-[#687576] text-sm">معمل تحاليل طبية متكامل</p>
      </div>

      <Card className="w-full max-w-lg border border-[#D9E1E0] shadow-sm bg-white rounded-xl">
        <CardHeader className="pb-4 border-b border-[#D9E1E0]">
          <CardTitle className="text-[#20292A] text-xl font-bold">
            تسجيل الدخول
          </CardTitle>
          <CardDescription className="text-[#687576] text-sm">
            أدخل رقم موبايلك وكلمة السر للدخول
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="login-phone"
                      className="text-[#20292A] font-medium text-sm"
                    >
                      رقم الموبايل
                      <span className="text-red-500 mr-1">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="login-phone"
                      type="tel"
                      aria-invalid={fieldState.invalid}
                      placeholder="01xxxxxxxxx"
                      autoComplete="tel"
                      dir="ltr"
                      className={cn(
                        "border-[#D9E1E0] focus:border-[#5E9C91] focus:ring-[#5E9C91]/20 text-left",
                        fieldState.invalid &&
                          "border-red-400 focus:border-red-400",
                      )}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between mb-1">
                      <FieldLabel
                        htmlFor="login-password"
                        className="text-[#20292A] font-medium text-sm"
                      >
                        كلمة السر
                        <span className="text-red-500 mr-1">*</span>
                      </FieldLabel>
                    </div>
                    <div className="relative">
                      <Input
                        {...field}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="أدخل كلمة السر"
                        autoComplete="current-password"
                        dir="ltr"
                        className={cn(
                          "border-[#D9E1E0] focus:border-[#5E9C91] focus:ring-[#5E9C91]/20 pl-10",
                          fieldState.invalid &&
                            "border-red-400 focus:border-red-400",
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#687576] hover:text-[#263B3D] transition-colors"
                        tabIndex={-1}
                        aria-label={
                          showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
          <Button
            type="submit"
            form="login-form"
            disabled={isLoading}
            className="cursor-pointer w-full bg-[#263B3D] hover:bg-[#1E3032] text-white font-medium py-2.5 rounded-lg transition-colors duration-150"
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>

          <p className="text-sm text-[#687576] text-center">
            ليس لديك حساب؟
            <Link
              href="/auth/register"
              className="text-[#5E9C91] hover:text-[#4E887E] font-medium transition-colors ms-1"
            >
              أنشئ حسابك الآن
            </Link>
          </p>
        </CardFooter>
      </Card>

      <p className="mt-6 text-xs text-[#687576] text-center">
        بياناتك محمية ولا تُستخدم إلا داخل نظام SH Medical Labs
      </p>
    </div>
  );
}
