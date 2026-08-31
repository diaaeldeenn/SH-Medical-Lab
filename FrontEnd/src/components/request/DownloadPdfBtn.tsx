"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getResultPdf } from "@/action/result.action";

export function DownloadResultPdfButton({
  requestId,
  testId,
  fileName,
}: {
  requestId: string;
  testId: string;
  fileName: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const { base64, contentType } = await getResultPdf(requestId, testId);

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر تحميل التقرير",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5E9C91] hover:text-[#4E887E] disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      تحميل PDF
    </button>
  );
}