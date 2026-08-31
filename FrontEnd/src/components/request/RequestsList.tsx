"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Clock, ChevronLeft } from "lucide-react";
import { RequestI } from "@/interfaces/request.interface";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant } from "@/constants/status";

export function RequestsList({ requests }: { requests: RequestI[] }) {
  return (
    <div className="bg-white border border-[#D9E1E0] rounded-xl overflow-hidden">
      {requests.map((request, index) => {
        return (
          <motion.div
            key={request._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className={index > 0 ? "border-t border-[#D9E1E0]" : ""}
          >
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-[10px] font-mono text-[#687576]">
                    {request.requestNumber}
                  </p>
                  <Badge variant={statusVariant[request.status] ?? "outline"}>
                    {statusLabel[request.status] ?? request.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {request.tests.map((t) => (
                    <span
                      key={t.testId}
                      className="text-[10px] bg-[#F4F7F6] text-[#687576] px-2 py-0.5 rounded-md"
                    >
                      {t.testName}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#687576]">
                  <Clock className="w-3 h-3 text-[#5E9C91] shrink-0" />
                  <span>{request.appointment.appointmentDate}</span>
                  <span dir="ltr" className="font-medium text-[#20292A]">
                    {request.appointment.appointmentTime}
                  </span>
                </div>
              </div>

              <Link
                href={`/requests/${request._id}`}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#5E9C91] hover:text-[#4E887E] border border-[#D9E1E0] hover:border-[#5E9C91] rounded-lg px-4 py-2 transition-colors shrink-0 self-start sm:self-center"
              >
                التفاصيل
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
