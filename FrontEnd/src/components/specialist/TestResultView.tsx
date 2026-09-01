import { DownloadResultPdfButton } from "@/components/request/DownloadPdfBtn";
import { ResultI } from "@/interfaces/result.interface";
import {
  parameterStatusClassName,
  parameterStatusLabel,
} from "@/constants/status";

export default function TestResultView({
  result,
  requestId,
  testId,
  testName,
}: {
  result: ResultI;
  requestId: string;
  testId: string;
  testName: string;
}) {
  return (
    <div className="bg-[#F4F7F6] border border-[#D9E1E0] rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {result.parameters.map((parameter) => (
          <div
            key={parameter.parameter}
            className="flex items-center justify-between gap-3 rounded-lg border border-[#D9E1E0] bg-white px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#687576]">
                {parameter.parameter}
              </p>
              <p className="mt-0.5 text-sm font-bold text-[#20292A]">
                {parameter.value}
                {parameter.unit && (
                  <span className="text-xs font-normal text-[#687576]">
                    {" "}
                    {parameter.unit}
                  </span>
                )}
              </p>
            </div>
            {parameter.status && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  parameterStatusClassName[parameter.status] ??
                  "bg-[#F4F7F6] text-[#687576]"
                }`}
              >
                {parameterStatusLabel[parameter.status] ?? parameter.status}
              </span>
            )}
          </div>
        ))}
      </div>

      {result.note && (
        <p className="text-xs text-[#687576]">ملاحظة: {result.note}</p>
      )}

      <div className="flex justify-end">
        <DownloadResultPdfButton
          requestId={requestId}
          testId={testId}
          fileName={`${testName}-${requestId}`}
        />
      </div>
    </div>
  );
}
