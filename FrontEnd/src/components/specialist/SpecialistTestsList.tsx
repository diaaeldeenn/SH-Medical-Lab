"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { FlaskConical, PlayCircle, ClipboardList } from "lucide-react";
import { RequestTestI } from "@/interfaces/request.interface";
import { ResultI } from "@/interfaces/result.interface";
import { TestI } from "@/interfaces/test.interface";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant, TestStatus } from "@/constants/status";
import { updateTestStatus } from "@/action/request.action";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TestResultForm from "./TestResultForm";
import TestResultView from "./TestResultView";

interface TestRow extends RequestTestI {
  schema: TestI | null;
  result: ResultI | null;
}

export default function SpecialistTestsList({
  requestId,
  requestStatus,
  tests,
}: {
  requestId: string;
  requestStatus: string;
  tests: TestRow[];
}) {
  const router = useRouter();
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [startingTestId, setStartingTestId] = useState<string | null>(null);

  const activeTest = tests.find((test) => test.testId === activeTestId) ?? null;

  const handleStartTest = async (testId: string) => {
    setStartingTestId(testId);
    try {
      await updateTestStatus(requestId, testId, {
        status: TestStatus.IN_PROGRESS,
      });
      toast.success("تم بدء هذا التحليل");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "فشل بدء التحليل");
    } finally {
      setStartingTestId(null);
    }
  };

  return (
    <div className="bg-white border border-[#D9E1E0] rounded-xl overflow-hidden">
      <div className="px-5 py-3 flex items-center gap-2 bg-[#F4F7F6] border-b border-[#D9E1E0]">
        <ClipboardList className="w-3.5 h-3.5 text-[#687576]" />
        <p className="text-xs font-medium text-[#687576]">التحاليل المطلوبة</p>
      </div>

      {tests.map((test, index) => (
        <motion.div
          key={test.testId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.03 }}
          className={index > 0 ? "border-t border-[#D9E1E0]" : ""}
        >
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-[#20292A]">
                  {test.testName}
                </p>
                <Badge variant={statusVariant[test.status] ?? "outline"}>
                  {statusLabel[test.status] ?? test.status}
                </Badge>
              </div>
              {test.schema && (
                <p className="text-[10px] text-[#687576] flex items-center gap-1.5">
                  <FlaskConical className="w-3 h-3 text-[#5E9C91]" />
                  {test.schema.medicalName} ·{" "}
                  {test.schema.sampleType === "Blood" ? "عينة دم" : "عينة بول"}
                </p>
              )}
            </div>

            <div className="shrink-0">
              {requestStatus === "IN_PROGRESS" && test.status === "PENDING" && (
                <button
                  onClick={() => handleStartTest(test.testId)}
                  disabled={startingTestId === test.testId}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#263B3D] border border-[#263B3D] hover:bg-[#263B3D] hover:text-white transition-colors rounded-lg px-4 py-2 disabled:opacity-50"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  بدء هذا التحليل
                </button>
              )}

              {requestStatus === "IN_PROGRESS" &&
                test.status === "IN_PROGRESS" &&
                test.schema && (
                  <button
                    onClick={() => setActiveTestId(test.testId)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#263B3D] hover:bg-[#1E3032] text-white transition-colors rounded-lg px-4 py-2"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    إدخال النتيجة
                  </button>
                )}

              {test.status === "COMPLETED" && test.result && (
                <span className="text-xs font-medium text-[#5E9C91]">
                  النتيجة مقفلة
                </span>
              )}
            </div>
          </div>

          {test.status === "COMPLETED" && test.result && (
            <div className="px-5 pb-4">
              <TestResultView
                result={test.result}
                requestId={requestId}
                testId={test.testId}
                testName={test.testName}
              />
            </div>
          )}
        </motion.div>
      ))}

      <Sheet
        open={!!activeTest}
        onOpenChange={(open) => !open && setActiveTestId(null)}
      >
        <SheetContent
          side="left"
          className="w-full sm:w-105 overflow-y-auto"
          dir="rtl"
        >
          {activeTest && activeTest.schema && (
            <>
              <SheetHeader>
                <SheetTitle className="text-[#20292A] mt-5">
                  {activeTest.testName}
                </SheetTitle>
              </SheetHeader>
              <TestResultForm
                requestId={requestId}
                testId={activeTest.testId}
                schema={activeTest.schema}
                onSuccess={() => setActiveTestId(null)}
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}