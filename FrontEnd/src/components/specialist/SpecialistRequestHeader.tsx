import { Clock, Phone, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RequestI } from "@/interfaces/request.interface";
import { statusLabel, statusVariant } from "@/constants/status";

export default function SpecialistRequestHeader({
  request,
}: {
  request: RequestI;
}) {
  return (
    <div className="bg-white border border-[#D9E1E0] rounded-xl px-6 py-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-mono text-[#5E9C91] tracking-wider mb-1">
            {request.requestNumber}
          </p>
          <h1 className="text-xl font-bold text-[#20292A]">
            {request.patient.name}
          </h1>
        </div>
        <Badge variant={statusVariant[request.status] ?? "outline"}>
          {statusLabel[request.status] ?? request.status}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-[#687576]">
        <span className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#5E9C91]" />
          <span dir="ltr">{request.patient.phone}</span>
        </span>

        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#5E9C91]" />
          {new Date(request.appointment.appointmentDate).toLocaleDateString(
            "ar-EG",
            { month: "short", day: "numeric", year: "numeric" },
          )}
          <span dir="ltr" className="font-medium text-[#20292A]">
            {request.appointment.appointmentTime}
          </span>
        </span>

        <span className="flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5 text-[#5E9C91]" />
          {request.tests.length}{" "}
          {request.tests.length === 1 ? "تحليل" : "تحاليل"}
        </span>
      </div>
    </div>
  );
}
