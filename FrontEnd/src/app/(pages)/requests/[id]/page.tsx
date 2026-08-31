import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Clock } from "lucide-react";
import { authOptions } from "@/lib/nextAuth/auth";
import { getRequestById } from "@/action/request.action";
import { getResultsByRequest } from "@/action/result.action";
import { RequestTestsTable } from "@/components/request/RequestTestsTable";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant } from "@/constants/status";
import RequestActions from "@/components/request/RequestActions";

export default async function RequestDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "PATIENT") {
    redirect("/");
  }

  const { id } = await params;

  const requestResponse = await getRequestById(id);
  const request = requestResponse.data;

  if (!request) {
    notFound();
  }

  if (request.patient._id !== session.user.id) {
    notFound();
  }

  const results = (await getResultsByRequest(id)).data ?? [];

  const canUpdateAppointment = request.status === "PENDING";
  const canCancelRequest = ["PENDING", "ATTENDED"].includes(request.status);

  return (
    <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-white border border-[#D9E1E0] rounded-xl px-6 py-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold text-[#20292A]">
              طلب {request.requestNumber}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant={statusVariant[request.status] ?? "outline"}>
                {statusLabel[request.status] ?? request.status}
              </Badge>
              <RequestActions
                requestId={request._id}
                currentDate={request.appointment.appointmentDate}
                currentTime={request.appointment.appointmentTime}
                canUpdateAppointment={canUpdateAppointment}
                canCancelRequest={canCancelRequest}
              />
            </div>
          </div>

          <p className="text-sm text-[#687576]">
            {request.patient.name} · {request.patient.phone}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[#687576]">
            <Clock className="w-3.5 h-3.5 text-[#5E9C91]" />
            <span>{request.appointment.appointmentDate}</span>
            <span dir="ltr" className="font-medium text-[#20292A]">
              {request.appointment.appointmentTime}
            </span>
          </div>
        </div>

        <RequestTestsTable
          requestId={request._id}
          tests={request.tests}
          results={results}
        />
      </div>
    </div>
  );
}