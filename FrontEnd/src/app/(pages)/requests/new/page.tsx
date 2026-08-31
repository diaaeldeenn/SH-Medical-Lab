"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import TestsStep from "./TestsStep";
import AppointmentStep from "./AppointmentStep";
import ReviewStep from "./ReviewStep";
import { TestI } from "@/interfaces/test.interface";
import { createRequest } from "@/action/request.action";

const STEPS = ["اختيار التحاليل", "الموعد", "المراجعة"];

export default function NewRequestPage() {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTests, setSelectedTests] = useState<TestI[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#263B3D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createRequest({
        tests: selectedTests.map((t) => t._id),
        appointment: {
          appointmentDate,
          appointmentTime,
        },
      });
      toast.success("تم إنشاء الطلب بنجاح");
      router.push("/requests");
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء إنشاء الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-10">
          <p className="text-xs font-medium text-[#5E9C91] tracking-wide mb-1">طلب جديد</p>
          <h1 className="text-2xl font-bold text-[#20292A]">حجز موعد تحليل</h1>
        </div>

        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    index < currentStep
                      ? "bg-[#5E9C91] text-white"
                      : index === currentStep
                      ? "bg-[#263B3D] text-white"
                      : "bg-[#D9E1E0] text-[#687576]"
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    index === currentStep ? "text-[#20292A]" : "text-[#687576]"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 transition-colors ${
                    index < currentStep ? "bg-[#5E9C91]" : "bg-[#D9E1E0]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#D9E1E0]">
          {currentStep === 0 && (
            <TestsStep
              selectedTests={selectedTests}
              onToggleTest={(test) => {
                setSelectedTests((prev) =>
                  prev.find((t) => t._id === test._id)
                    ? prev.filter((t) => t._id !== test._id)
                    : [...prev, test]
                );
              }}
              onNext={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 1 && (
            <AppointmentStep
              appointmentDate={appointmentDate}
              appointmentTime={appointmentTime}
              onDateChange={setAppointmentDate}
              onTimeChange={setAppointmentTime}
              onBack={() => setCurrentStep(0)}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <ReviewStep
              selectedTests={selectedTests}
              appointmentDate={appointmentDate}
              appointmentTime={appointmentTime}
              isSubmitting={isSubmitting}
              onBack={() => setCurrentStep(1)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}