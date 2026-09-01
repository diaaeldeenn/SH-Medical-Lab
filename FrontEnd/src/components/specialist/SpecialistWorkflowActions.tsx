"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import {
  UserCheck,
  Droplets,
  PlayCircle,
  CheckCircle2,
  Loader2,
  Ban,
} from "lucide-react";
import {
  attendRequest,
  collectSampleRequest,
  startProcessingRequest,
  completeRequest,
} from "@/action/request.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const STEPS = [
  { key: "PENDING", label: "طلب جديد" },
  { key: "ATTENDED", label: "تم الحضور" },
  { key: "SAMPLE_COLLECTED", label: "سحب العينة" },
  { key: "IN_PROGRESS", label: "قيد التحليل" },
  { key: "COMPLETED", label: "مكتمل" },
];

export default function SpecialistWorkflowActions({
  requestId,
  status,
  allTestsCompleted,
}: {
  requestId: string;
  status: string;
  allTestsCompleted: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const currentIndex = STEPS.findIndex((step) => step.key === status);

  const handleAttend = async () => {
    setIsLoading(true);
    try {
      await attendRequest(requestId);
      toast.success("تم تأكيد حضور المريض");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "فشل تأكيد الحضور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectSample = async () => {
    setIsLoading(true);
    try {
      await collectSampleRequest(requestId);
      toast.success("تم تسجيل سحب جميع العينات");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "فشل تسجيل سحب العينات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await startProcessingRequest(requestId);
      toast.success("تم بدء التحليل");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "فشل بدء التحليل");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await completeRequest(requestId);
      toast.success("تم إنهاء الطلب بنجاح");
      setIsCompleteOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "فشل إنهاء الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 bg-white border border-[#D9E1E0] rounded-xl px-5 py-4">
        <Ban className="w-4 h-4 text-red-500" />
        <p className="text-sm text-[#687576]">
          تم إلغاء هذا الطلب من قبل المريض
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D9E1E0] rounded-xl px-5 py-5 space-y-5">
      <div className="space-y-2">
        <div className="h-1.5 rounded-full bg-[#F4F7F6] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full bg-[#5E9C91] rounded-full"
          />
        </div>
        <div className="grid grid-cols-5 gap-1">
          {STEPS.map((step, index) => (
            <span
              key={step.key}
              className={`text-[10px] text-center font-medium ${
                index <= currentIndex ? "text-[#263B3D]" : "text-[#687576]"
              }`}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center justify-end w-full">
          {status === "PENDING" && (
            <button
              onClick={handleAttend}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
              تأكيد الحضور
            </button>
          )}

          {status === "ATTENDED" && (
            <button
              onClick={handleCollectSample}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Droplets className="w-3.5 h-3.5" />
              )}
              تأكيد سحب جميع العينات
            </button>
          )}

          {status === "SAMPLE_COLLECTED" && (
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <PlayCircle className="w-3.5 h-3.5" />
              )}
              بدء التحليل
            </button>
          )}

          {status === "IN_PROGRESS" &&
            (allTestsCompleted ? (
              <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
                <DialogTrigger>
                  <span className="inline-flex items-center gap-2 bg-[#5E9C91] hover:bg-[#4E887E] text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    إنهاء الطلب
                  </span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white rounded-2xl" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold text-[#20292A]">
                      تأكيد إنهاء الطلب
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-xs text-[#687576] py-2">
                    سيتم إنشاء تقرير PDF كامل للطلب وإتاحته للمريض فورًا. هل
                    تريد المتابعة؟
                  </p>
                  <DialogFooter className="flex items-center gap-2 sm:justify-start">
                    <button
                      onClick={handleComplete}
                      disabled={isLoading}
                      className="px-4 py-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2 flex-1"
                    >
                      {isLoading && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      نعم، إنهاء الطلب
                    </button>
                    <button
                      onClick={() => setIsCompleteOpen(false)}
                      className="px-4 py-2 border border-[#D9E1E0] text-[#687576] hover:text-[#20292A] text-xs font-medium rounded-xl transition-colors"
                    >
                      تراجع
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <span className="inline-flex items-center gap-2 bg-[#F4F7F6] text-[#687576] text-xs font-medium px-5 py-2.5 rounded-xl cursor-not-allowed">
                <CheckCircle2 className="w-3.5 h-3.5" />
                إنهاء الطلب
              </span>
            ))}

          {status === "COMPLETED" && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#5E9C91]">
              <CheckCircle2 className="w-4 h-4" />
              تم إنهاء الطلب بالكامل
            </div>
          )}
        </div>

        {status === "IN_PROGRESS" && !allTestsCompleted && (
          <p className="text-[10px] text-[#687576]">
            لا يمكن إنهاء الطلب قبل إدخال نتائج جميع التحاليل
          </p>
        )}
      </div>
    </div>
  );
}