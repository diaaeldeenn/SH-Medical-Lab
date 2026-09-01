"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { FlaskConical, Loader2, Plus } from "lucide-react";
import { TestI } from "@/interfaces/test.interface";
import { deleteTest } from "@/action/test.action";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import TestCard from "./TestCard";
import TestForm from "./TestForm";

export default function TestsGrid({
  tests,
  isSpecialist,
}: {
  tests: TestI[];
  isSpecialist: boolean;
}) {
  const router = useRouter();
  const [sheetTest, setSheetTest] = useState<TestI | "new" | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<TestI | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await deleteTest(deleteCandidate._id);
      toast.success("تم حذف التحليل بنجاح");
      setDeleteCandidate(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "فشل حذف التحليل");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {isSpecialist && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setSheetTest("new")}
            className="inline-flex items-center gap-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة تحليل جديد
          </button>
        </div>
      )}

      {tests.length === 0 ? (
        <div className="bg-white border border-dashed border-[#D9E1E0] rounded-xl px-6 py-16 text-center space-y-3">
          <FlaskConical className="w-7 h-7 text-[#D9E1E0] mx-auto" />
          <p className="text-sm text-[#687576]">لا توجد تحاليل مطابقة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tests.map((test, index) => (
            <motion.div
              key={test._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
            >
              <TestCard
                test={test}
                isSpecialist={isSpecialist}
                onEdit={() => setSheetTest(test)}
                onDelete={() => setDeleteCandidate(test)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <Sheet
        open={!!sheetTest}
        onOpenChange={(open) => !open && setSheetTest(null)}
      >
        <SheetContent
          side="left"
          className="w-full sm:w-120 overflow-y-auto"
          dir="rtl"
        >
          <SheetHeader>
            <SheetTitle className="text-[#20292A]">
              {sheetTest === "new" ? "إضافة تحليل جديد" : "تعديل التحليل"}
            </SheetTitle>
          </SheetHeader>
          {sheetTest && (
            <TestForm
              initialData={sheetTest === "new" ? undefined : sheetTest}
              onSuccess={() => setSheetTest(null)}
            />
          )}
        </SheetContent>
      </Sheet>

      <Dialog
        open={!!deleteCandidate}
        onOpenChange={(open) => !open && setDeleteCandidate(null)}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl" dir="rtl">
          <DialogHeader className="pt-4">
            <DialogTitle className="text-base font-bold text-[#20292A]">
              تأكيد حذف التحليل
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-[#687576] py-2">
            هل أنت متأكد من حذف تحليل &quot;{deleteCandidate?.nameAr}&quot;؟
          </p>
          <DialogFooter className="flex items-center gap-2 sm:justify-start">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2 flex-1"
            >
              {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              نعم، احذف
            </button>
            <button
              onClick={() => setDeleteCandidate(null)}
              className="px-4 py-2 border border-[#D9E1E0] text-[#687576] hover:text-[#20292A] text-xs font-medium rounded-xl transition-colors"
            >
              تراجع
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
