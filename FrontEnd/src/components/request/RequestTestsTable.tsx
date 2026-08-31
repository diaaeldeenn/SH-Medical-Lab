"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RequestTestI } from "@/interfaces/request.interface";
import { ResultI } from "@/interfaces/result.interface";
import {
  parameterStatusClassName,
  parameterStatusLabel,
  statusLabel,
  statusVariant,
} from "@/constants/status";
import { DownloadResultPdfButton } from "./DownloadPdfBtn";

export function RequestTestsTable({
  requestId,
  tests,
  results,
}: {
  requestId: string;
  tests: RequestTestI[];
  results: ResultI[];
}) {
  const [openTestId, setOpenTestId] = useState<string | null>(null);
  const resultByTestId = new Map(
    results.map((result) => [result.test, result]),
  );

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>التحليل</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left">النتيجة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => {
            const result = resultByTestId.get(test.testId);
            const isOpen = openTestId === test.testId;

            return (
              <Fragment key={test.testId}>
                <TableRow>
                  <TableCell className="font-medium">{test.testName}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[test.status] ?? "outline"}>
                      {statusLabel[test.status] ?? test.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    {result ? (
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() =>
                            setOpenTestId(isOpen ? null : test.testId)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5E9C91] hover:text-[#4E887E]"
                        >
                          {isOpen ? "إخفاء النتيجة" : "عرض النتيجة"}
                          <ChevronDown
                            className={`size-4 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <DownloadResultPdfButton
                          requestId={requestId}
                          testId={test.testId}
                          fileName={`${test.testName}-${requestId}`}
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        لم تظهر بعد
                      </span>
                    )}
                  </TableCell>
                </TableRow>

                {result ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3} className="p-0">
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-muted/40"
                          >
                            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                              {result.parameters.map((parameter) => (
                                <div
                                  key={parameter.parameter}
                                  className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3"
                                >
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium">
                                      {parameter.parameter}
                                    </p>
                                    <p className="mt-0.5 text-sm font-bold">
                                      {parameter.value}
                                      {parameter.unit ? (
                                        <span className="text-xs font-normal text-muted-foreground">
                                          {" "}
                                          {parameter.unit}
                                        </span>
                                      ) : null}
                                    </p>
                                    {parameter.normalRange ? (
                                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                                        المدى الطبيعي: {parameter.normalRange}
                                      </p>
                                    ) : null}
                                  </div>
                                  {parameter.status ? (
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                        parameterStatusClassName[
                                          parameter.status
                                        ] ?? "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {parameterStatusLabel[parameter.status] ??
                                        parameter.status}
                                    </span>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                            {result.note ? (
                              <p className="px-4 pb-4 text-sm text-muted-foreground">
                                ملاحظة الأخصائي: {result.note}
                              </p>
                            ) : null}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
