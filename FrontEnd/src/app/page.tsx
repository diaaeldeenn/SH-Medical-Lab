import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import {
  FlaskConical,
  CalendarCheck,
  FileText,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronLeft,
  Bell,
  ClipboardList,
  Plus,
  FileSearch,
  Microscope,
} from "lucide-react";
import { authOptions } from "@/lib/nextAuth/auth";
import { RequestI } from "@/interfaces/request.interface";
import { NotificationI } from "@/interfaces/notification.interface";
import { TestI } from "@/interfaces/test.interface";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AnimatedSection, {
  AnimatedItem,
} from "@/components/home/AnimatedSection";
import { statusLabel, statusVariant } from "@/constants/status";
import { getAllRequest, getMyRequest } from "@/action/request.action";
import { getMyNotification } from "@/action/notification.action";
import StatsCounter from "@/components/home/StatsCounter";
import TestsMarquee from "@/components/home/TestsMarquee";
import { getTests } from "@/service/test.api";
import RequestsPagination from "@/components/home/RequestsPagination";
import RequestsTransition from "@/components/ui/RequestsTransition";

const services = [
  {
    icon: FlaskConical,
    title: "تحاليل دقيقة",
    desc: "أجهزة حديثة وكوادر متخصصة تضمن دقة النتائج في أقل وقت.",
  },
  {
    icon: CalendarCheck,
    title: "حجز مواعيد سهل",
    desc: "احجز موعدك أونلاين في ثوانٍ واختر التوقيت الأنسب لك.",
  },
  {
    icon: FileText,
    title: "تقارير PDF معتمدة",
    desc: "نتائجك بصيغة PDF طبية معتمدة تصل إليك فور الانتهاء.",
  },
  {
    icon: Bell,
    title: "إشعارات فورية",
    desc: "نُعلمك بمجرد ظهور نتائجك، بدون ما تحتاج تتابع بنفسك.",
  },
];

const steps = [
  {
    num: "01",
    title: "أنشئ حسابك",
    desc: "سجل ببياناتك الأساسية في دقيقة واحدة.",
  },
  {
    num: "02",
    title: "اختر تحاليلك وموعدك",
    desc: "حدد التحاليل المطلوبة واختر وقت الحضور المناسب.",
  },
  {
    num: "03",
    title: "احضر للمعمل",
    desc: "قدّم رقم طلبك عند الوصول ويتم سحب العينات فورًا.",
  },
  {
    num: "04",
    title: "استلم نتائجك",
    desc: "تصلك إشعار فور انتهاء التحليل وتحمل تقريرك PDF.",
  },
];

const REQUESTS_PER_PAGE = 5;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const role = user?.role;
  const params = await searchParams;

  if (role === "PATIENT") {
    const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

    const [requestsRes, notificationsRes] = await Promise.all([
      getMyRequest(currentPage, REQUESTS_PER_PAGE).catch(() => null),
      getMyNotification(1, 4).catch(() => null),
    ]);

    const requests: RequestI[] = requestsRes?.data?.data ?? [];
    const totalRequests: number = requestsRes?.data?.meta?.totalDocs ?? 0;
    const totalPages: number = Math.ceil(totalRequests / REQUESTS_PER_PAGE);
    const notifications: NotificationI[] = notificationsRes?.data?.data ?? [];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
      <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
        <section className="relative h-[85vh] min-h-150 w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&q=85"
            alt="معمل تحاليل SH Medical Labs"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-[#263B3D]/82" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24 max-w-5xl">
            <span className="inline-flex items-center gap-2 text-[#5E9C91] text-xs font-mono tracking-widest uppercase mb-6 w-fit">
              <span className="w-6 h-px bg-[#5E9C91]" />
              SH Medical Labs
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl">
              أهلًا، {user?.name?.split(" ")[0]}
              <br />
              <span className="text-[#5E9C91]">نتائجك جاهزة</span>
              <br />
              في أي وقت
            </h1>
            <p className="text-white/60 text-sm sm:text-base mt-6 max-w-md leading-relaxed">
              تابع طلباتك، راجع نتائج تحاليلك، واحجز مواعيد جديدة بسهولة.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-10">
              <Link
                href="/requests/new"
                className="bg-[#5E9C91] hover:bg-[#4E887E] text-white text-sm font-medium px-7 py-3.5 rounded-xl transition-colors shadow-sm"
              >
                حجز تحليل جديد
              </Link>
              <Link
                href="/requests"
                className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-7 py-3.5 rounded-xl transition-colors border border-white/20"
              >
                طلباتي
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-5 mt-10">
              {["نتائج دقيقة 98%", "تقارير PDF فورية", "إشعارات لحظية"].map(
                (item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-xs text-white/60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5E9C91]" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30">
            <span className="text-[10px] tracking-widest uppercase">اكتشف</span>
            <div className="w-px h-8 bg-white/20" />
          </div>
        </section>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#D9E1E0]">
          {[
            {
              href: "/requests/new",
              icon: Plus,
              label: "حجز تحليل",
              sub: "طلب جديد",
              accent: true,
            },
            {
              href: "/requests",
              icon: ClipboardList,
              label: "طلباتي",
              sub: totalRequests > 0 ? `${totalRequests} طلب` : "لا يوجد",
              accent: false,
            },
            {
              href: "/notifications",
              icon: Bell,
              label: "الإشعارات",
              sub:
                unreadCount > 0 ? `${unreadCount} غير مقروء` : "لا يوجد جديد",
              accent: false,
              badge: unreadCount,
            },
            {
              href: "/requests?status=COMPLETED",
              icon: FileText,
              label: "النتائج",
              sub: "طلبات مكتملة",
              accent: false,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-2 py-6 transition-colors text-center ${
                item.accent
                  ? "bg-[#263B3D] hover:bg-[#1E3032] text-white"
                  : "bg-white hover:bg-[#F4F7F6] text-[#20292A]"
              }`}
            >
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-3 left-3 w-4 h-4 rounded-full bg-[#5E9C91] text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
              <item.icon
                className={`w-5 h-5 ${item.accent ? "text-white/80" : "text-[#5E9C91]"}`}
              />
              <div>
                <p className="text-xs font-bold">{item.label}</p>
                <p
                  className={`text-[10px] mt-0.5 ${item.accent ? "text-white/50" : "text-[#687576]"}`}
                >
                  {item.sub}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 py-14 space-y-10">
          <AnimatedSection>
            <AnimatedItem>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E9C91]" />
                    <h2 className="text-sm font-bold text-[#20292A]">طلباتي</h2>
                    {totalRequests > 0 && (
                      <span className="text-xs text-[#687576] font-mono">
                        ({totalRequests})
                      </span>
                    )}
                  </div>
                  <Link
                    href="/requests"
                    className="text-xs text-[#5E9C91] hover:text-[#4E887E] transition-colors flex items-center gap-1"
                  >
                    الكل
                    <ChevronLeft className="w-3 h-3" />
                  </Link>
                </div>

                <RequestsTransition>
                  {requests.length > 0 ? (
                    <div className="bg-white border border-[#D9E1E0] rounded-xl overflow-hidden">
                      {requests.map((r, index) => (
                        <div key={r._id}>
                          <div className="px-4 sm:px-5 py-4 flex items-start gap-4">
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <p className="text-[10px] font-mono text-[#687576]">
                                  {r.requestNumber}
                                </p>

                                <Badge
                                  variant={statusVariant[r.status] ?? "outline"}
                                >
                                  {statusLabel[r.status] ?? r.status}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {r.tests.map((t) => (
                                  <span
                                    key={t.testId}
                                    className="text-[10px] bg-[#F4F7F6] text-[#687576] px-2 py-0.5 rounded-md"
                                  >
                                    {t.testName}
                                  </span>
                                ))}
                              </div>

                              {r.appointment?.appointmentDate && (
                                <div className="flex items-center gap-1.5 text-[10px] text-[#687576]">
                                  <Clock className="w-3 h-3 text-[#5E9C91] shrink-0" />

                                  <span>
                                    {new Date(
                                      r.appointment.appointmentDate,
                                    ).toLocaleDateString("ar-EG", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>

                                  {r.appointment.appointmentTime && (
                                    <span
                                      dir="ltr"
                                      className="font-medium text-[#20292A]"
                                    >
                                      {r.appointment.appointmentTime}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 shrink-0">
                              <Link
                                href={`/requests/${r._id}`}
                                className="text-[10px] font-medium text-[#5E9C91] hover:text-[#4E887E] border border-[#D9E1E0] hover:border-[#5E9C91] rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap text-center"
                              >
                                التفاصيل
                              </Link>

                              {r.status === "COMPLETED" && (
                                <Link
                                  href={`/requests/${r._id}`}
                                  className="text-[10px] font-medium bg-[#263B3D] hover:bg-[#1E3032] text-white rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap text-center"
                                >
                                  النتائج
                                </Link>
                              )}
                            </div>
                          </div>

                          {index < requests.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#D9E1E0] border-dashed rounded-xl px-6 py-14 text-center space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F4F7F6] flex items-center justify-center mx-auto">
                        <FlaskConical className="w-5 h-5 text-[#5E9C91]" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#20292A]">
                          لا يوجد طلبات بعد
                        </p>

                        <p className="text-xs text-[#687576] mt-1">
                          ابدأ بحجز أول تحليل لك الآن
                        </p>
                      </div>

                      <Link
                        href="/requests/new"
                        className="inline-flex items-center gap-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-xs font-medium px-6 py-2.5 rounded-xl transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        ابدأ بطلبك الأول
                      </Link>
                    </div>
                  )}
                </RequestsTransition>

                {totalPages > 1 && (
                  <RequestsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                )}
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <div className="bg-white border border-[#D9E1E0] rounded-xl overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E9C91]" />
                    <h2 className="text-sm font-bold text-[#20292A]">
                      الإشعارات
                    </h2>
                    {unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#5E9C91] text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/notifications"
                    className="text-xs text-[#5E9C91] hover:text-[#4E887E] transition-colors flex items-center gap-1"
                  >
                    عرض الكل
                    <ChevronLeft className="w-3 h-3" />
                  </Link>
                </div>
                <Separator />
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map((n, index) => (
                      <div key={n._id}>
                        <div
                          className={`px-5 py-4 flex items-start gap-3 ${!n.isRead ? "bg-[#F4F7F6]" : ""}`}
                        >
                          <span
                            className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${!n.isRead ? "bg-[#5E9C91]" : ""}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#20292A]">
                              {n.title}
                            </p>
                            <p className="text-xs text-[#687576] mt-0.5 leading-relaxed">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-[#687576] mt-1.5 font-mono">
                              {new Date(n.createdAt).toLocaleDateString(
                                "ar-EG",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        {index < notifications.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-10 text-center">
                    <Bell className="w-6 h-6 text-[#D9E1E0] mx-auto mb-2" />
                    <p className="text-sm text-[#687576]">لا توجد إشعارات</p>
                  </div>
                )}
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <div className="bg-[#263B3D] rounded-xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-white/50 font-mono tracking-widest uppercase mb-1">
                    جاهز لتحليل جديد؟
                  </p>
                  <p className="text-base font-bold text-white">
                    احجز موعدك الآن في ثوانٍ
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    اختر التحاليل، حدد الوقت، واحضر للمعمل.
                  </p>
                </div>
                <Link
                  href="/requests/new"
                  className="inline-flex items-center gap-2 bg-[#5E9C91] hover:bg-[#4E887E] text-white text-xs font-medium px-6 py-3 rounded-xl transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  طلب جديد
                </Link>
              </div>
            </AnimatedItem>
          </AnimatedSection>
        </div>

        <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="text-xs text-[#5E9C91] font-mono tracking-widest uppercase">
              خدماتنا
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20292A] mt-2">
              كل ما تحتاجه في مكان واحد
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-white border border-[#D9E1E0] rounded-2xl p-6 space-y-4 hover:border-[#5E9C91] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F4F7F6] group-hover:bg-[#5E9C91]/10 flex items-center justify-center transition-colors">
                  <s.icon className="w-5 h-5 text-[#5E9C91]" />
                </div>
                <h3 className="text-sm font-bold text-[#20292A]">{s.title}</h3>
                <p className="text-xs text-[#687576] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border-y border-[#D9E1E0]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto min-h-80">
              <Image
                src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80"
                alt="أجهزة تحليل"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="px-8 sm:px-12 py-16 flex flex-col justify-center">
              <span className="text-xs text-[#5E9C91] font-mono tracking-widest uppercase mb-3">
                من نحن
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#20292A] leading-snug">
                معمل حديث يجمع
                <br />
                الدقة والراحة
              </h2>
              <p className="text-sm text-[#687576] mt-5 leading-7 max-w-sm">
                SH Medical Labs معمل تحاليل طبية يعتمد على أحدث الأجهزة وأكثر
                الكوادر خبرة. هدفنا الأول هو منحك نتائج دقيقة تصل إليك بأسرع وقت
                ممكن، بدون تعقيد في الإجراءات.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  { icon: MapPin, text: "متاح للزيارة والحجز أونلاين" },
                  { icon: Clock, text: "المواعيد المتاحة: 2م، 5م، 8م يوميًا" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 text-xs text-[#687576]"
                  >
                    <item.icon className="w-4 h-4 text-[#5E9C91] shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#263B3D]">
          <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24 py-20">
            <div className="mb-14">
              <span className="text-xs text-[#5E9C91] font-mono tracking-widest uppercase">
                كيف يعمل النظام
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                من الحجز لاستلام النتيجة
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <div key={s.num} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-4 left-0 w-full h-px bg-white/10" />
                  )}
                  <div className="relative">
                    <span className="text-4xl font-bold text-white/10 font-mono">
                      {s.num}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2">
                      {s.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-2 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (role === "SPECIALIST") {
    const requestsRes = await getAllRequest(1, 10).catch(() => null);

    const requests: RequestI[] = requestsRes?.data?.data ?? [];
    const totalDocs: number = requestsRes?.data?.meta?.totalDocs ?? 0;

    const pendingCount: number = requests.filter(
      (r) => r.status === "PENDING",
    ).length;
    const inProgressCount: number = requests.filter((r) =>
      ["IN_PROGRESS", "SAMPLE_COLLECTED", "ATTENDED"].includes(r.status),
    ).length;
    const completedCount: number = requests.filter(
      (r) => r.status === "COMPLETED",
    ).length;

    return (
      <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
        <div className="border-b border-[#D9E1E0] bg-white px-6 py-8 sm:px-12">
          <div className="max-w-3xl mx-auto flex items-end justify-between gap-4">
            <div>
              <span className="text-[#5E9C91] text-xs font-mono tracking-widest uppercase">
                SHLab - لوحة الأخصائي
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#20292A] mt-1">
                أهلًا، {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-xs text-[#687576] mt-1 font-mono">
                {new Date().toLocaleDateString("ar-EG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Link
              href="/specialist/requests"
              className="inline-flex items-center gap-2 bg-[#5E9C91] hover:bg-[#4E887E] text-white text-xs font-medium px-5 py-2.5 rounded-lg transition-colors shrink-0"
            >
              <FileSearch className="w-3.5 h-3.5" />
              كل الطلبات
              {totalDocs > 0 && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalDocs}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <AnimatedSection>
            <AnimatedItem>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "قيد الانتظار",
                    value: pendingCount,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    border: "border-amber-100",
                    href: "/specialist/requests?status=PENDING",
                  },
                  {
                    label: "جارٍ التحليل",
                    value: inProgressCount,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    border: "border-blue-100",
                    href: "/specialist/requests?status=IN_PROGRESS",
                  },
                  {
                    label: "مكتمل",
                    value: completedCount,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    border: "border-emerald-100",
                    href: "/specialist/requests?status=COMPLETED",
                  },
                ].map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className={`${s.bg} border ${s.border} rounded-lg px-4 py-5 text-center hover:opacity-80 transition-opacity`}
                  >
                    <p className={`text-2xl font-bold ${s.color} tabular-nums`}>
                      {s.value}
                    </p>
                    <p className="text-xs text-[#687576] mt-1">{s.label}</p>
                  </Link>
                ))}
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <div className="bg-white border border-[#D9E1E0] rounded-lg overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E9C91]" />
                    <h2 className="text-sm font-bold text-[#20292A]">
                      الطلبات الأخيرة
                    </h2>
                    {totalDocs > 0 && (
                      <span className="text-xs text-[#687576] font-mono">
                        ({totalDocs})
                      </span>
                    )}
                  </div>
                  <Link
                    href="/specialist/requests"
                    className="text-xs text-[#5E9C91] hover:text-[#4E887E] transition-colors flex items-center gap-1"
                  >
                    عرض الكل
                    <ChevronLeft className="w-3 h-3" />
                  </Link>
                </div>
                <Separator />
                {requests.length > 0 ? (
                  <div>
                    {requests.map((r, index) => (
                      <div key={r._id}>
                        <Link
                          href={`/specialist/requests/${r._id}`}
                          className="flex items-center justify-between px-5 py-4 hover:bg-[#F4F7F6] transition-colors group"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <p className="text-[10px] font-mono text-[#687576]">
                              {r.requestNumber}
                            </p>
                            <p className="text-sm font-medium text-[#20292A] truncate">
                              {r.patient?.name}
                            </p>
                            <p className="text-xs text-[#687576]">
                              {r.tests.length}{" "}
                              {r.tests.length === 1 ? "تحليل" : "تحاليل"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0 mr-4">
                            <Badge
                              variant={statusVariant[r.status] ?? "outline"}
                            >
                              {statusLabel[r.status] ?? r.status}
                            </Badge>
                            {r.appointment?.appointmentDate && (
                              <p className="text-[10px] text-[#687576] font-mono">
                                {new Date(
                                  r.appointment.appointmentDate,
                                ).toLocaleDateString("ar-EG", {
                                  month: "short",
                                  day: "numeric",
                                })}
                                {r.appointment.appointmentTime && (
                                  <span dir="ltr">
                                    {" "}
                                    {r.appointment.appointmentTime}
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                          <ChevronLeft className="w-4 h-4 text-[#D9E1E0] group-hover:text-[#5E9C91] transition-colors mr-2 shrink-0" />
                        </Link>
                        {index < requests.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center space-y-3">
                    <Microscope className="w-6 h-6 text-[#D9E1E0] mx-auto" />
                    <p className="text-sm text-[#687576]">
                      لا توجد طلبات حالياً
                    </p>
                  </div>
                )}
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/specialist/requests"
                  className="bg-white border border-[#D9E1E0] hover:border-[#5E9C91] rounded-lg px-5 py-5 flex items-center gap-4 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F4F7F6] group-hover:bg-[#5E9C91]/10 flex items-center justify-center transition-colors shrink-0">
                    <FileSearch className="w-4 h-4 text-[#5E9C91]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#20292A]">
                      إدارة الطلبات
                    </p>
                    <p className="text-xs text-[#687576] mt-0.5">
                      بحث وفلترة وإدارة كاملة
                    </p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#D9E1E0] group-hover:text-[#5E9C91] mr-auto transition-colors" />
                </Link>
                <Link
                  href="/specialist/requests?status=PENDING"
                  className="bg-white border border-[#D9E1E0] hover:border-[#5E9C91] rounded-lg px-5 py-5 flex items-center gap-4 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F4F7F6] group-hover:bg-[#5E9C91]/10 flex items-center justify-center transition-colors shrink-0">
                    <ClipboardList className="w-4 h-4 text-[#5E9C91]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#20292A]">
                      طلبات بانتظار الحضور
                    </p>
                    <p className="text-xs text-[#687576] mt-0.5">
                      الطلبات التي لم يُؤكد حضورها
                    </p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#D9E1E0] group-hover:text-[#5E9C91] mr-auto transition-colors" />
                </Link>
              </div>
            </AnimatedItem>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  const testsRes = await getTests(1, 20).catch(() => null);
  const tests: TestI[] = testsRes?.data?.data ?? [];
  const marqueeItems =
    tests.length > 0
      ? tests.map((t) => `${t.nameAr} — ${t.code}`)
      : [
          "CBC",
          "LFT",
          "KFT",
          "HbA1c",
          "Vitamin D",
          "Urinalysis",
          "CRP",
          "Lipid Profile",
        ];

  return (
    <div className="min-h-screen bg-[#F4F7F6]" dir="rtl">
      <section className="relative h-[90vh] min-h-150 w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&q=85"
          alt="معمل تحاليل SH Medical Labs"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-[#263B3D]/82" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24 max-w-5xl">
          <span className="inline-flex items-center gap-2 text-[#5E9C91] text-xs font-mono tracking-widest uppercase mb-6 w-fit">
            <span className="w-6 h-px bg-[#5E9C91]" />
            SH Medical Labs
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl">
            نتائج تحاليلك
            <br />
            <span className="text-[#5E9C91]">في أيديك</span>
            <br />
            في أقل وقت
          </h1>
          <p className="text-white/60 text-sm sm:text-base mt-6 max-w-md leading-relaxed">
            معمل تحاليل طبية متكامل. احجز موعدك، تابع نتائجك، وحمل تقريرك الطبي
            PDF بدون أي تعقيد.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-10">
            <Link
              href="/auth/register"
              className="bg-[#5E9C91] hover:bg-[#4E887E] text-white text-sm font-medium px-7 py-3.5 rounded-xl transition-colors shadow-sm"
            >
              ابدأ الآن
            </Link>
            <Link
              href="/auth/login"
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-7 py-3.5 rounded-xl transition-colors border border-white/20"
            >
              تسجيل الدخول
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-5 mt-10">
            {["نتائج دقيقة 98%", "تقارير PDF فورية", "حجز أونلاين 24/7"].map(
              (item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-xs text-white/60"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5E9C91]" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30">
          <span className="text-[10px] tracking-widest uppercase">اكتشف</span>
          <div className="w-px h-8 bg-white/20" />
        </div>
      </section>

      <TestsMarquee items={marqueeItems} />
      <StatsCounter />

      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-6xl mx-auto">
        <div className="mb-12">
          <span className="text-xs text-[#5E9C91] font-mono tracking-widest uppercase">
            خدماتنا
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#20292A] mt-2">
            كل ما تحتاجه في مكان واحد
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white border border-[#D9E1E0] rounded-2xl p-6 space-y-4 hover:border-[#5E9C91] transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F4F7F6] group-hover:bg-[#5E9C91]/10 flex items-center justify-center transition-colors">
                <s.icon className="w-5 h-5 text-[#5E9C91]" />
              </div>
              <h3 className="text-sm font-bold text-[#20292A]">{s.title}</h3>
              <p className="text-xs text-[#687576] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-[#D9E1E0]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-64 lg:h-auto min-h-80">
            <Image
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80"
              alt="أجهزة تحليل"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="px-8 sm:px-12 py-16 flex flex-col justify-center">
            <span className="text-xs text-[#5E9C91] font-mono tracking-widest uppercase mb-3">
              من نحن
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20292A] leading-snug">
              معمل حديث يجمع
              <br />
              الدقة والراحة
            </h2>
            <p className="text-sm text-[#687576] mt-5 leading-7 max-w-sm">
              SH Medical Labs معمل تحاليل طبية يعتمد على أحدث الأجهزة وأكثر
              الكوادر خبرة. هدفنا الأول هو منحك نتائج دقيقة تصل إليك بأسرع وقت
              ممكن، بدون تعقيد في الإجراءات.
            </p>
            <div className="mt-8 space-y-3">
              {[
                { icon: MapPin, text: "متاح للزيارة والحجز أونلاين" },
                { icon: Clock, text: "المواعيد المتاحة: 2م، 5م، 8م يوميًا" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 text-xs text-[#687576]"
                >
                  <item.icon className="w-4 h-4 text-[#5E9C91] shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {tests.length > 0 && (
        <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="text-xs text-[#5E9C91] font-mono tracking-widest uppercase">
              التحاليل المتاحة
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20292A] mt-2">
              أشهر التحاليل وأسعارها
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tests.slice(0, 12).map((t) => (
              <div
                key={t._id}
                className="bg-white border border-[#D9E1E0] rounded-xl px-5 py-4 flex items-center justify-between hover:border-[#5E9C91] transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#20292A]">
                    {t.nameAr}
                  </p>
                  <p className="text-xs text-[#687576] font-mono">{t.code}</p>
                </div>
                <div className="text-left shrink-0">
                  <p className="text-sm font-bold text-[#263B3D]">{t.price}</p>
                  <p className="text-[10px] text-[#687576]">جنيه</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 text-sm text-[#5E9C91] hover:text-[#4E887E] transition-colors font-medium"
            >
              سجل لحجز تحليلك
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="bg-[#263B3D]">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24 py-20">
          <div className="mb-14">
            <span className="text-xs text-[#5E9C91] font-mono tracking-widest uppercase">
              كيف يعمل النظام
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              من الحجز لاستلام النتيجة
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-4 left-0 w-full h-px bg-white/10" />
                )}
                <div className="relative">
                  <span className="text-4xl font-bold text-white/10 font-mono">
                    {s.num}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="relative h-72 sm:h-80">
          <Image
            src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1400&q=80"
            alt="نتائج تحاليل"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#263B3D]/88" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white max-w-md">
              احجز تحليلك الآن
            </h2>
            <p className="text-white/60 text-sm mt-3 max-w-xs">
              سجل حسابك في دقيقة واحدة وابدأ تجربة معمل مختلفة.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link
                href="/auth/register"
                className="bg-[#5E9C91] hover:bg-[#4E887E] text-white text-sm font-medium px-8 py-3.5 rounded-xl transition-colors"
              >
                إنشاء حساب
              </Link>
              <Link
                href="/auth/login"
                className="bg-transparent border border-white/30 hover:border-white/60 text-white text-sm font-medium px-8 py-3.5 rounded-xl transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
