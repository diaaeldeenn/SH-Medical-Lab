import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth/auth";
import { getRequestById } from "@/action/request.action";
import { getResultsByRequest } from "@/action/result.action";
import { getTestById } from "@/action/test.action";
import { RequestI } from "@/interfaces/request.interface";
import { ResultI } from "@/interfaces/result.interface";
import { TestI } from "@/interfaces/test.interface";
import SpecialistRequestHeader from "@/components/specialist/SpecialistRequestHeader";
import SpecialistWorkflowActions from "@/components/specialist/SpecialistWorkflowActions";
import SpecialistTestsList from "@/components/specialist/SpecialistTestsList";

export default async function SpecialistRequestDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "SPECIALIST") {
    redirect("/");
  }

  const { id } = await params;

  const requestResponse = await getRequestById(id).catch(() => null);
  const request: RequestI | null = requestResponse?.data ?? null;

  if (!request) {
    notFound();
  }

  const results: ResultI[] =
    (await getResultsByRequest(id).catch(() => ({ data: [] }))).data ?? [];

  const testSchemas = await Promise.all(
    request.tests.map((test) =>
      getTestById(test.testId)
        .then((response) => response.data as TestI)
        .catch(() => null),
    ),
  );

  const testRows = request.tests.map((test, index) => ({
    ...test,
    schema: testSchemas[index],
    result: results.find((result) => result.test === test.testId) ?? null,
  }));

  const allTestsCompleted = request.tests.every(
    (test) => test.status === "COMPLETED",
  );

  return (
    <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <SpecialistRequestHeader request={request} />
        <SpecialistWorkflowActions
          requestId={request._id}
          status={request.status}
          allTestsCompleted={allTestsCompleted}
        />
        <SpecialistTestsList
          requestId={request._id}
          requestStatus={request.status}
          tests={testRows}
        />
      </div>
    </div>
  );
}
