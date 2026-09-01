"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAllAsRead } from "@/action/notification.action";

export default function MarkAllReadButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsSubmitting(true);
    try {
      await markAllAsRead();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "تعذر تحديد الإشعارات كمقروءة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isSubmitting}
      onClick={handleClick}
      className="border-[#D9E1E0] text-[#263B3D] hover:border-[#5E9C91]"
    >
      <CheckCheck size={14} />
      {isSubmitting ? "جارٍ التحديث..." : "تحديد الكل كمقروء"}
    </Button>
  );
}
