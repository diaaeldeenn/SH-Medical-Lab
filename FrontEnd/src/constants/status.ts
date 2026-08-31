export const statusLabel: Record<string, string> = {
  PENDING: "قيد الانتظار",
  ATTENDED: "تم الحضور",
  SAMPLE_COLLECTED: "تم سحب العينة",
  IN_PROGRESS: "جارٍ التحليل",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

export const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  ATTENDED: "secondary",
  SAMPLE_COLLECTED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export const parameterStatusLabel: Record<string, string> = {
  NORMAL: "طبيعي",
  HIGH: "↑ مرتفع",
  LOW: "↓ منخفض",
};

export const parameterStatusClassName: Record<string, string> = {
  NORMAL: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  HIGH: "bg-red-50 text-red-600 border border-red-100",
  LOW: "bg-blue-50 text-blue-600 border border-blue-100",
};