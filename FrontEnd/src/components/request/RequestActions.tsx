"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cancelRequest, updateAppointment } from "@/action/request.action";
import { Trash2, Calendar, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RequestActionsProps {
  requestId: string;
  currentDate: string;
  currentTime: string;
  canUpdateAppointment: boolean;
  canCancelRequest: boolean;
}

export default function RequestActions({
  requestId,
  currentDate,
  currentTime,
  canUpdateAppointment,
  canCancelRequest,
}: RequestActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
  };

  const [newDate, setNewDate] = useState(formatDateForInput(currentDate));
  const [newTime, setNewTime] = useState(currentTime || "02:00 PM");

  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await cancelRequest(requestId);
      toast.success("تم إلغاء الطلب بنجاح");
      setIsCancelOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "فشل إلغاء الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    const payload: { appointmentDate?: string; appointmentTime?: string } = {};

    if (newDate && newDate !== formatDateForInput(currentDate)) {
      payload.appointmentDate = newDate;
    }
    if (newTime && newTime !== currentTime) {
      payload.appointmentTime = newTime;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("لم تقم بتغيير أي بيانات في الموعد");
      setIsUpdateOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      await updateAppointment(requestId, payload);
      toast.success("تم تحديث الموعد بنجاح");
      setIsUpdateOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "فشل تحديث الموعد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {canUpdateAppointment && (
        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogTrigger>
            <span className="px-3 py-1.5 text-xs font-medium text-[#263B3D] border border-[#263B3D] hover:bg-[#263B3D] hover:text-white transition-colors rounded-lg flex items-center gap-1 cursor-pointer">
              <Calendar className="w-3.5 h-3.5" />
              تعديل الموعد
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-[#20292A]">
                تعديل موعد الحضور
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#687576]">
                  التاريخ الجديد
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#D9E1E0] rounded-xl bg-white text-[#20292A] focus:outline-none focus:border-[#263B3D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#687576]">
                  الوقت الجديد
                </label>
                <Select
                  value={newTime}
                  onValueChange={(value) => {
                    if (value) setNewTime(value);
                  }}
                >
                  <SelectTrigger className="w-full text-xs border-[#D9E1E0] rounded-xl">
                    <SelectValue placeholder="اختر الوقت" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="02:00 PM">٢:٠٠ مساءً</SelectItem>
                    <SelectItem value="05:00 PM">٥:٠٠ مساءً</SelectItem>
                    <SelectItem value="08:00 PM">٨:٠٠ مساءً</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="flex items-center gap-2 sm:justify-start">
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-4 py-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2 flex-1"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                حفظ التعديلات
              </button>
              <button
                onClick={() => setIsUpdateOpen(false)}
                className="px-4 py-2 border border-[#D9E1E0] text-[#687576] hover:text-[#20292A] text-xs font-medium rounded-xl transition-colors"
              >
                إلغاء
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {canCancelRequest && (
        <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <DialogTrigger>
            <span className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors rounded-lg flex items-center gap-1 cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" />
              إلغاء الطلب
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl" dir="rtl">
            <DialogHeader className="pt-4">
              <DialogTitle className="text-base font-bold text-[#20292A] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                تأكيد إلغاء الطلب
              </DialogTitle>
            </DialogHeader>

            <p className="text-xs text-[#687576] py-2">
              هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا
              الإجراء بعد تأكيده.
            </p>

            <DialogFooter className="flex items-center gap-2 sm:justify-start">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2 flex-1"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                نعم، إلغاء الطلب
              </button>
              <button
                onClick={() => setIsCancelOpen(false)}
                className="px-4 py-2 border border-[#D9E1E0] text-[#687576] hover:text-[#20292A] text-xs font-medium rounded-xl transition-colors"
              >
                تراجع
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
