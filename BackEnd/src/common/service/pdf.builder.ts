import PDFDocument from "pdfkit";
import path from "path";
import { ResultStatus } from "../../common/enum/result.enum.js";
import type { ResultParameterI } from "../../DB/models/result.model.js";
import { Gender } from "../enum/user.enum.js";
import type { Types } from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COLORS = {
  primary: "#263B3D",
  accent: "#5E9C91",
  background: "#F4F7F6",
  surface: "#FFFFFF",
  text: "#20292A",
  muted: "#687576",
  border: "#D9E1E0",

  normal: "#16a34a",
  high: "#dc2626",
  low: "#2563eb",
};

const FONTS = {
  regular: path.resolve(__dirname, "../../assets/fonts/Cairo-Regular.ttf"),
  bold: path.resolve(__dirname, "../../assets/fonts/Cairo-Bold.ttf"),
};

interface PatientInfo {
  name: string;
  phone: string;
  dateOfBirth: Date;
  gender: Gender;
}

interface PDFReportData {
  requestNumber: string;
  collectionDate: Date;
  reportedBy: string;
  patient: PatientInfo;
  testName: string;
  medicalName?: string;
  parameters: ResultParameterI[];
  note?: string;
  printedAt?: Date;
}

export interface PatientI {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  dateOfBirth: Date;
  gender: Gender;
}

export interface RequestWithPatientI {
  requestNumber: string;
  appointment?: { appointmentDate: Date };
  patient?: PatientI;
}

export interface CreatorI {
  name: string;
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() &&
      today.getDate() >= dateOfBirth.getDate());
  if (!hasBirthdayPassed) age--;
  return age;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: Date): string {
  return (
    formatDate(date) +
    " " +
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}

function statusColor(status?: ResultStatus): string {
  if (status === ResultStatus.HIGH) return COLORS.high;
  if (status === ResultStatus.LOW) return COLORS.low;
  return COLORS.normal;
}

function statusFlag(status?: ResultStatus): string {
  if (status === ResultStatus.HIGH) return "H";
  if (status === ResultStatus.LOW) return "L";
  return "";
}

export function buildResultPDF(data: PDFReportData): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    bufferPages: true,
  });

  doc.registerFont("Regular", FONTS.regular);
  doc.registerFont("Bold", FONTS.bold);

  const PAGE_W = doc.page.width;
  const MARGIN = 40;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const FOOTER_SPACE = 60;

  const drawHeader = () => {
    doc.save();
    doc.rect(0, 0, PAGE_W, 90).fill(COLORS.primary);

    doc
      .font("Bold")
      .fontSize(22)
      .fillColor(COLORS.surface)
      .text("SH Medical Labs", MARGIN, 22);

    doc
      .font("Regular")
      .fontSize(9)
      .fillColor(COLORS.accent)
      .text("Precision Diagnostics — Trusted Results", MARGIN, 48);

    doc
      .font("Regular")
      .fontSize(8)
      .fillColor(COLORS.border)
      .text("LABORATORY REPORT", PAGE_W - MARGIN - 140, 22, {
        width: 140,
        align: "right",
      });

    doc
      .font("Bold")
      .fontSize(10)
      .fillColor(COLORS.surface)
      .text(data.requestNumber, PAGE_W - MARGIN - 140, 38, {
        width: 140,
        align: "right",
      });
    doc.restore();
  };

  const drawFooter = () => {
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      const PAGE_H = doc.page.height;
      const FOOTER_TOP = PAGE_H - 48;

      doc.save();
      doc
        .moveTo(MARGIN, FOOTER_TOP)
        .lineTo(PAGE_W - MARGIN, FOOTER_TOP)
        .strokeColor(COLORS.border)
        .lineWidth(0.5)
        .stroke();

      doc
        .font("Regular")
        .fontSize(7.5)
        .fillColor(COLORS.muted)
        .text(
          "This report is intended for medical use only. Results should be interpreted in the context of clinical findings.",
          MARGIN,
          FOOTER_TOP + 8,
          { width: CONTENT_W - 120 },
        );

      const printedAt = data.printedAt ?? new Date();
      doc
        .font("Regular")
        .fontSize(7.5)
        .fillColor(COLORS.muted)
        .text(
          `SH Medical Labs | Printed: ${formatDate(printedAt)}`,
          MARGIN,
          FOOTER_TOP + 22,
          { width: CONTENT_W, align: "right" },
        );
      doc.restore();
    }
  };

  drawHeader();

  const INFO_TOP = 105;
  const INFO_H = 90;

  doc
    .rect(MARGIN, INFO_TOP, CONTENT_W, INFO_H)
    .fillAndStroke(COLORS.background, COLORS.border);

  const age = calculateAge(data.patient.dateOfBirth);
  const gender = data.patient.gender === Gender.MALE ? "Male" : "Female";

  doc
    .font("Bold")
    .fontSize(13)
    .fillColor(COLORS.text)
    .text(data.patient.name, MARGIN + 14, INFO_TOP + 14);

  doc
    .font("Regular")
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      `${age} yrs | ${gender} | ${data.patient.phone}`,
      MARGIN + 14,
      INFO_TOP + 32,
    );

  doc
    .font("Regular")
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      `DOB: ${formatDate(data.patient.dateOfBirth)}`,
      MARGIN + 14,
      INFO_TOP + 48,
    );

  const RIGHT_COL = PAGE_W - MARGIN - 180;

  doc
    .font("Regular")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text("Collection Date", RIGHT_COL, INFO_TOP + 14);

  doc
    .font("Bold")
    .fontSize(9)
    .fillColor(COLORS.text)
    .text(formatDateTime(data.collectionDate), RIGHT_COL, INFO_TOP + 27);

  doc
    .font("Regular")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text("Reported By", RIGHT_COL, INFO_TOP + 50);

  doc
    .font("Bold")
    .fontSize(9)
    .fillColor(COLORS.text)
    .text(data.reportedBy, RIGHT_COL, INFO_TOP + 63);

  let TEST_TOP = INFO_TOP + INFO_H + 20;

  if (doc.y > TEST_TOP) {
    TEST_TOP = doc.y;
  }

  doc
    .font("Bold")
    .fontSize(12)
    .fillColor(COLORS.primary)
    .text(data.testName, MARGIN, TEST_TOP);

  if (data.medicalName) {
    doc
      .font("Regular")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(data.medicalName, MARGIN, TEST_TOP + 18);
  }

  const COL = {
    parameter: MARGIN,
    result: MARGIN + 210,
    unit: MARGIN + 290,
    range: MARGIN + 370,
    flag: MARGIN + 480,
  };

  const TABLE_TOP = TEST_TOP + (data.medicalName ? 44 : 28);
  let rowY = TABLE_TOP;
  const ROW_H = 24;

  const drawTableHeader = (y: number) => {
    doc.rect(MARGIN, y, CONTENT_W, 22).fill(COLORS.primary);
    const headerY = y + 6;
    doc.font("Bold").fontSize(8).fillColor(COLORS.surface);
    doc.text("PARAMETER", COL.parameter + 6, headerY);
    doc.text("RESULT", COL.result, headerY);
    doc.text("UNIT", COL.unit, headerY);
    doc.text("REFERENCE RANGE", COL.range, headerY);
    doc.text("FLAG", COL.flag, headerY);
  };

  drawTableHeader(rowY);
  rowY += 22;

  data.parameters.forEach((param, index) => {
    const pageBottom = doc.page.height - FOOTER_SPACE;
    if (rowY + ROW_H > pageBottom) {
      doc.addPage();
      rowY = MARGIN + 20;
      drawTableHeader(rowY);
      rowY += 22;
    }

    const isEven = index % 2 === 0;
    const isAbnormal =
      param.status === ResultStatus.HIGH || param.status === ResultStatus.LOW;

    if (isEven) {
      doc.rect(MARGIN, rowY, CONTENT_W, ROW_H).fill(COLORS.surface);
    } else {
      doc.rect(MARGIN, rowY, CONTENT_W, ROW_H).fill(COLORS.background);
    }

    const textY = rowY + 7;
    const valueColor = isAbnormal ? statusColor(param.status) : COLORS.text;

    doc
      .font("Regular")
      .fontSize(9)
      .fillColor(COLORS.text)
      .text(param.parameter, COL.parameter + 6, textY, { width: 198 });

    doc
      .font(isAbnormal ? "Bold" : "Regular")
      .fontSize(9)
      .fillColor(valueColor)
      .text(String(param.value), COL.result, textY, { width: 80 });

    doc
      .font("Regular")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(param.unit ?? "", COL.unit, textY, { width: 72 });

    doc
      .font("Regular")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(param.normalRange ?? "", COL.range, textY, { width: 104 });

    if (isAbnormal) {
      const flag = statusFlag(param.status);
      const badgeColor = statusColor(param.status);
      doc.rect(COL.flag, rowY + 4, 16, 15).fill(badgeColor);
      doc
        .font("Bold")
        .fontSize(8)
        .fillColor(COLORS.surface)
        .text(flag, COL.flag + 4, rowY + 7);
    }

    rowY += ROW_H;
  });

  doc
    .moveTo(MARGIN, rowY)
    .lineTo(MARGIN + CONTENT_W, rowY)
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .stroke();

  if (data.note) {
    const noteSpaceNeeded = 40;
    const pageBottom = doc.page.height - FOOTER_SPACE;
    if (rowY + noteSpaceNeeded > pageBottom) {
      doc.addPage();
      rowY = MARGIN + 20;
    }

    rowY += 16;

    doc.rect(MARGIN, rowY, CONTENT_W, 1).fill(COLORS.border);

    rowY += 10;

    doc
      .font("Bold")
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text("Note:", MARGIN, rowY);

    doc
      .font("Regular")
      .fontSize(9)
      .fillColor(COLORS.text)
      .text(data.note, MARGIN + 36, rowY, { width: CONTENT_W - 36 });
  }

  drawFooter();

  doc.end();
  return doc;
}
