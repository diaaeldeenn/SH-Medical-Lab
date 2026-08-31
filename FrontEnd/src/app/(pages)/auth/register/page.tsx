"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { format, parse, isValid, isAfter, isBefore } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Eye,
  EyeOff,
  FlaskConical,
} from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { registerSchema, RegisterType } from "@/validation/auth.validation";
import { registerApi } from "@/service/auth.api";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dobInputValue, setDobInputValue] = useState("");
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    new Date(2000, 0, 1),
  );
  const dobInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      email: "",
      name: "",
      password: "",
      rePassword: "",
      phone: "",
      dateOfBirth: undefined,
      gender: "MALE",
    },
  });

  async function onSubmit(data: RegisterType) {
    try {
      setIsLoading(true);

      await registerApi(data);

      toast.success("تم إنشاء الحساب بنجاح");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error?.message || "حدث خطأ، يرجى المحاولة مرة أخرى");
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
            إنشاء حساب جديد
          </CardTitle>
          <CardDescription className="text-[#687576] text-sm">
            أدخل بياناتك للتسجيل في منظومة SH Medical Labs
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="register-name"
                      className="text-[#20292A] font-medium text-sm"
                    >
                      الاسم الكامل
                      <span className="text-red-500 mr-1">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="ضياء محمد"
                      autoComplete="name"
                      className={cn(
                        "border-[#D9E1E0] focus:border-[#5E9C91] focus:ring-[#5E9C91]/20",
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
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="register-phone"
                      className="text-[#20292A] font-medium text-sm"
                    >
                      رقم الموبايل
                      <span className="text-red-500 mr-1">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-phone"
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
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="register-email"
                      className="text-[#20292A] font-medium text-sm"
                    >
                      البريد الإلكتروني
                      <span className="text-[#687576] text-xs mr-2">
                        (اختياري)
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="example@email.com"
                      autoComplete="email"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Controller
                  name="dateOfBirth"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const minDate = new Date(1940, 0, 1);
                    const maxDate = new Date();

                    function handleInputChange(
                      e: React.ChangeEvent<HTMLInputElement>,
                    ) {
                      const raw = e.target.value;
                      setDobInputValue(raw);

                      if (raw.length === 10) {
                        const parsed = parse(raw, "dd/MM/yyyy", new Date());
                        if (
                          isValid(parsed) &&
                          !isAfter(parsed, maxDate) &&
                          !isBefore(parsed, minDate)
                        ) {
                          field.onChange(parsed);
                          setCalendarMonth(parsed);
                        } else {
                          field.onChange(undefined);
                        }
                      } else {
                        field.onChange(undefined);
                      }
                    }

                    function handleInputKeyDown(
                      e: React.KeyboardEvent<HTMLInputElement>,
                    ) {
                      const allowed = [
                        "Backspace",
                        "Delete",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Home",
                        "End",
                      ];
                      if (allowed.includes(e.key)) return;
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault();
                        return;
                      }
                      const cur = dobInputValue.replace(/\//g, "");
                      const digits = cur + e.key;
                      let formatted = digits;
                      if (digits.length > 2)
                        formatted = digits.slice(0, 2) + "/" + digits.slice(2);
                      if (digits.length > 4)
                        formatted =
                          digits.slice(0, 2) +
                          "/" +
                          digits.slice(2, 4) +
                          "/" +
                          digits.slice(4, 8);
                      e.preventDefault();
                      setDobInputValue(formatted);

                      if (formatted.length === 10) {
                        const parsed = parse(
                          formatted,
                          "dd/MM/yyyy",
                          new Date(),
                        );
                        if (
                          isValid(parsed) &&
                          !isAfter(parsed, maxDate) &&
                          !isBefore(parsed, minDate)
                        ) {
                          field.onChange(parsed);
                          setCalendarMonth(parsed);
                        } else {
                          field.onChange(undefined);
                        }
                      } else {
                        field.onChange(undefined);
                      }
                    }

                    function handleDaySelect(day: Date | undefined) {
                      field.onChange(day);
                      if (day) {
                        setDobInputValue(format(day, "dd/MM/yyyy"));
                        setCalendarMonth(day);
                      }
                    }

                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="register-dob-input"
                          className="text-[#20292A] font-medium text-sm"
                        >
                          تاريخ الميلاد
                          <span className="text-red-500 mr-1">*</span>
                        </FieldLabel>
                        <Popover>
                          <div className="relative">
                            <Input
                              ref={dobInputRef}
                              id="register-dob-input"
                              value={dobInputValue}
                              onChange={handleInputChange}
                              onKeyDown={handleInputKeyDown}
                              placeholder="يوم / شهر / سنة"
                              autoComplete="bday"
                              maxLength={10}
                              dir="ltr"
                              aria-invalid={fieldState.invalid}
                              className={cn(
                                "border-[#D9E1E0] focus:border-[#5E9C91] focus:ring-[#5E9C91]/20 pr-10 text-left",
                                fieldState.invalid &&
                                  "border-red-400 focus:border-red-400",
                              )}
                            />
                            <PopoverTrigger
                              render={
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#687576] hover:text-[#263B3D] transition-colors"
                                  aria-label="فتح التقويم"
                                />
                              }
                            >
                              <CalendarIcon size={16} />
                            </PopoverTrigger>
                          </div>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={handleDaySelect}
                              month={calendarMonth}
                              onMonthChange={setCalendarMonth}
                              captionLayout="dropdown"
                              startMonth={minDate}
                              endMonth={maxDate}
                              locale={ar}
                              disabled={(date) =>
                                isAfter(date, maxDate) ||
                                isBefore(date, minDate)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                <Controller
                  name="gender"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[#20292A] font-medium text-sm">
                        النوع
                        <span className="text-red-500 mr-1">*</span>
                      </FieldLabel>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {[
                          { value: "MALE", label: "ذكر" },
                          { value: "FEMALE", label: "أنثى" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "py-2 px-4 rounded-lg border text-sm font-medium transition-all duration-150",
                              field.value === option.value
                                ? "bg-[#263B3D] text-white border-[#263B3D]"
                                : "bg-white text-[#687576] border-[#D9E1E0] hover:border-[#5E9C91] hover:text-[#263B3D]",
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="register-password"
                      className="text-[#20292A] font-medium text-sm"
                    >
                      كلمة السر
                      <span className="text-red-500 mr-1">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="8 أحرف على الأقل"
                        autoComplete="new-password"
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

              <Controller
                name="rePassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="register-repassword"
                      className="text-[#20292A] font-medium text-sm"
                    >
                      تأكيد كلمة السر
                      <span className="text-red-500 mr-1">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="register-repassword"
                        type={showRePassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="أعد إدخال كلمة السر"
                        autoComplete="new-password"
                        dir="ltr"
                        className={cn(
                          "border-[#D9E1E0] focus:border-[#5E9C91] focus:ring-[#5E9C91]/20 pl-10",
                          fieldState.invalid &&
                            "border-red-400 focus:border-red-400",
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRePassword((v) => !v)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#687576] hover:text-[#263B3D] transition-colors"
                        tabIndex={-1}
                        aria-label={
                          showRePassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"
                        }
                      >
                        {showRePassword ? (
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
            form="register-form"
            disabled={isLoading}
            className="cursor-pointer w-full bg-[#263B3D] hover:bg-[#1E3032] text-white font-medium py-2.5 rounded-lg transition-colors duration-150"
          >
            {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>

          <p className="text-sm text-[#687576] text-center">
            لديك حساب بالفعل؟
            <Link
              href="/auth/login"
              className="text-[#5E9C91] hover:text-[#4E887E] font-medium transition-colors ms-1"
            >
              سجل دخولك
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
