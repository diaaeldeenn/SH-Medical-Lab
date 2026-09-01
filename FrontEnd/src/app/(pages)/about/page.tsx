import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import AboutReveal, { AboutRevealItem } from "@/components/about/AboutReveal";
import Footer from "@/components/footer";

const values = [
  {
    icon: ShieldCheck,
    title: "الدقة أولًا",
    description:
      "نضع دقة النتائج وجودة الإجراءات في مقدمة كل خطوة، لأن النتيجة الطبية مسؤولية قبل أن تكون رقمًا.",
  },
  {
    icon: HeartPulse,
    title: "المريض محور اهتمامنا",
    description:
      "نصمم تجربة بسيطة وواضحة تساعدك على متابعة طلبك ونتائجك بدون إجراءات معقدة.",
  },
  {
    icon: Microscope,
    title: "تقنية موثوقة",
    description:
      "نعتمد على بيئة عمل حديثة وأدوات مناسبة تساعد المختصين على تقديم نتائج موثوقة.",
  },
  {
    icon: UsersRound,
    title: "فريق متخصص",
    description:
      "وراء كل نتيجة فريق من المتخصصين يتعامل مع العينات والنتائج بعناية واهتمام.",
  },
];

const workflow = [
  {
    number: "01",
    icon: Stethoscope,
    title: "طلب التحليل",
    description: "ابدأ طلبك بسهولة وحدد ما تحتاجه والموعد المناسب للحضور.",
  },
  {
    number: "02",
    icon: Microscope,
    title: "تحليل العينة",
    description:
      "يتم التعامل مع عينتك بعناية وإجراء التحاليل المطلوبة وفق الإجراءات المعتمدة.",
  },
  {
    number: "03",
    icon: FileCheck2,
    title: "مراجعة النتيجة",
    description: "بعد الانتهاء، يتم تسجيل النتيجة ومراجعتها قبل إتاحتها لك.",
  },
  {
    number: "04",
    icon: HeartPulse,
    title: "نتيجتك بين يديك",
    description:
      "تصلك إشعار بالنتيجة ويمكنك الوصول إليها وتحميل التقرير الطبي بسهولة.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F4F7F6]" dir="rtl">
      <section className="relative min-h-[72vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1800&q=85"
          alt="فريق طبي داخل معمل"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[#263B3D]/85" />

        <div className="absolute inset-0 bg-linear-to-l from-[#263B3D]/95 via-[#263B3D]/70 to-transparent" />

        <div className="relative z-10 flex min-h-[72vh] items-center">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-12 lg:px-24">
            <AboutReveal>
              <AboutRevealItem>
                <div className="max-w-2xl">
                  <div className="mb-6 inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#5E9C91]">
                    SH MEDICAL LABS
                  </div>

                  <h1 className="text-4xl font-bold leading-[1.2] text-white sm:text-5xl lg:text-6xl">
                    نهتم بالتفاصيل
                    <br />
                    <span className="text-[#5E9C91]">التي تصنع الفرق</span>
                  </h1>

                  <p className="mt-7 max-w-xl text-sm leading-8 text-white/65 sm:text-base">
                    في SH Medical Labs نؤمن أن تجربة التحاليل الطبية لا يجب أن
                    تكون معقدة. لذلك جمعنا بين الدقة الطبية والتقنية الحديثة
                    لنقدم لك تجربة واضحة، سريعة، ومريحة من بداية طلب التحليل
                    وحتى استلام النتيجة.
                  </p>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <Link
                      href="/auth/register"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#5E9C91] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#4E887E]"
                    >
                      ابدأ تجربتك
                      <ArrowLeft className="h-4 w-4" />
                    </Link>

                    <Link
                      href="/"
                      className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
                    >
                      العودة للرئيسية
                    </Link>
                  </div>
                </div>
              </AboutRevealItem>
            </AboutReveal>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-widest">من نحن</span>
          <span className="h-8 w-px bg-white/20" />
        </div>
      </section>

      <section className="border-b border-[#D9E1E0] bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 sm:px-12 lg:grid-cols-2 lg:gap-20 lg:px-24">
          <AboutReveal>
            <AboutRevealItem>
              <div className="relative h-80 overflow-hidden rounded-2xl sm:h-100">
                <Image
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&q=80"
                  alt="بيئة عمل طبية حديثة"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-[#263B3D]/15" />

                <div className="absolute bottom-5 right-5 rounded-xl border border-white/20 bg-[#263B3D]/85 px-5 py-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">SH</p>
                  <p className="mt-1 text-[10px] text-white/55">Medical Labs</p>
                </div>
              </div>
            </AboutRevealItem>
          </AboutReveal>

          <AboutReveal>
            <AboutRevealItem>
              <div className="flex h-full flex-col justify-center">
                <span className="text-xs font-mono tracking-widest text-[#5E9C91]">
                  من نحن
                </span>

                <h2 className="mt-3 text-2xl font-bold leading-snug text-[#20292A] sm:text-3xl">
                  معمل طبي يفكر في
                  <br />
                  <span className="text-[#5E9C91]">تجربة المريض أيضًا</span>
                </h2>

                <p className="mt-6 text-sm leading-8 text-[#687576]">
                  SH Medical Labs هو معمل تحاليل طبية تم تصميمه ليجعل رحلة
                  المريض أبسط وأكثر وضوحًا. لا نركز فقط على إجراء التحليل، ولكن
                  على التجربة كاملة بداية من إنشاء الطلب وحتى الوصول إلى
                  النتيجة.
                </p>

                <p className="mt-4 text-sm leading-8 text-[#687576]">
                  من خلال النظام الرقمي، تستطيع متابعة طلبك ومعرفة حالته والوصول
                  إلى نتائجك وتقاريرك الطبية بسهولة، بينما يحصل فريق المختصين
                  على الأدوات التي تساعده على إدارة الطلبات والنتائج بكفاءة.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#D9E1E0] bg-[#F4F7F6] p-4">
                    <p className="text-sm font-bold text-[#263B3D]">
                      تجربة رقمية
                    </p>
                    <p className="mt-1 text-xs leading-6 text-[#687576]">
                      متابعة الطلب والنتيجة من مكان واحد.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#D9E1E0] bg-[#F4F7F6] p-4">
                    <p className="text-sm font-bold text-[#263B3D]">
                      اهتمام بالتفاصيل
                    </p>
                    <p className="mt-1 text-xs leading-6 text-[#687576]">
                      كل خطوة لها هدف واضح في رحلة التحليل.
                    </p>
                  </div>
                </div>
              </div>
            </AboutRevealItem>
          </AboutReveal>
        </div>
      </section>

      <section className="bg-[#F4F7F6]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-12 lg:px-24">
          <AboutReveal>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AboutRevealItem>
                <div className="h-full rounded-2xl bg-[#263B3D] p-7 sm:p-9">
                  <span className="text-xs font-mono tracking-widest text-[#5E9C91]">
                    رؤيتنا
                  </span>

                  <h2 className="mt-4 text-2xl font-bold text-white">
                    أن تصبح تجربة التحاليل
                    <br />
                    أبسط وأكثر ثقة.
                  </h2>

                  <p className="mt-5 max-w-lg text-sm leading-8 text-white/55">
                    نطمح إلى بناء تجربة تجمع بين جودة الخدمة الطبية وسهولة
                    التكنولوجيا، بحيث يكون الوصول إلى المعلومة والنتيجة جزءًا
                    طبيعيًا من رحلة المريض.
                  </p>
                </div>
              </AboutRevealItem>

              <AboutRevealItem>
                <div className="h-full rounded-2xl border border-[#D9E1E0] bg-white p-7 sm:p-9">
                  <span className="text-xs font-mono tracking-widest text-[#5E9C91]">
                    رسالتنا
                  </span>

                  <h2 className="mt-4 text-2xl font-bold text-[#20292A]">
                    نقدم خدمة طبية
                    <br />
                    <span className="text-[#5E9C91]">واضحة وموثوقة.</span>
                  </h2>

                  <p className="mt-5 max-w-lg text-sm leading-8 text-[#687576]">
                    نعمل على توفير بيئة تساعد على تقديم نتائج دقيقة مع تجربة
                    رقمية سهلة، مع الحفاظ على اهتمامنا بالتفاصيل واحتياجات
                    المريض في كل مرحلة.
                  </p>
                </div>
              </AboutRevealItem>
            </div>
          </AboutReveal>
        </div>
      </section>

      <section className="border-y border-[#D9E1E0] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-12 lg:px-24">
          <AboutReveal>
            <AboutRevealItem>
              <div className="mb-12 max-w-xl">
                <span className="text-xs font-mono tracking-widest text-[#5E9C91]">
                  ما يميزنا
                </span>

                <h2 className="mt-3 text-2xl font-bold text-[#20292A] sm:text-3xl">
                  مبادئنا في كل نتيجة
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#687576]">
                  التكنولوجيا تساعدنا، لكن الجودة تبدأ من الطريقة التي نتعامل
                  بها مع كل طلب وكل عينة وكل نتيجة.
                </p>
              </div>
            </AboutRevealItem>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <AboutRevealItem key={value.title}>
                    <article className="group h-full rounded-2xl border border-[#D9E1E0] bg-[#F4F7F6] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#5E9C91] hover:bg-white">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white transition-colors group-hover:bg-[#5E9C91]/10">
                        <Icon className="h-5 w-5 text-[#5E9C91]" />
                      </div>

                      <h3 className="mt-5 text-sm font-bold text-[#20292A]">
                        {value.title}
                      </h3>

                      <p className="mt-2 text-xs leading-7 text-[#687576]">
                        {value.description}
                      </p>
                    </article>
                  </AboutRevealItem>
                );
              })}
            </div>
          </AboutReveal>
        </div>
      </section>

      <section className="overflow-hidden bg-[#263B3D]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-12 lg:px-24">
          <AboutReveal>
            <AboutRevealItem>
              <div className="mb-14 max-w-xl">
                <span className="text-xs font-mono tracking-widest text-[#5E9C91]">
                  رحلتك معنا
                </span>

                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  من أول طلب
                  <br />
                  حتى ظهور النتيجة
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  صممنا خطوات النظام لتكون واضحة، بحيث تعرف دائمًا أين وصل طلبك
                  وما الذي سيحدث بعد ذلك.
                </p>
              </div>
            </AboutRevealItem>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {workflow.map((item, index) => {
                const Icon = item.icon;

                return (
                  <AboutRevealItem key={item.number}>
                    <div className="relative">
                      {index < workflow.length - 1 && (
                        <div className="absolute right-[calc(100%+1rem)] top-7 hidden h-px w-10 bg-white/10 lg:block" />
                      )}

                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                          <Icon className="h-5 w-5 text-[#5E9C91]" />
                        </div>

                        <span className="text-3xl font-bold font-mono text-white/10">
                          {item.number}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-7 text-white/45">
                        {item.description}
                      </p>
                    </div>
                  </AboutRevealItem>
                );
              })}
            </div>
          </AboutReveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 sm:px-12 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-24">
          <AboutReveal>
            <AboutRevealItem>
              <div>
                <span className="text-xs font-mono tracking-widest text-[#5E9C91]">
                  تجربة مختلفة
                </span>

                <h2 className="mt-3 text-2xl font-bold leading-snug text-[#20292A] sm:text-3xl">
                  لأن النتيجة الطبية
                  <br />
                  ليست نهاية الرحلة
                </h2>

                <p className="mt-6 text-sm leading-8 text-[#687576]">
                  بعد إجراء التحليل، أهم شيء هو أن تصل النتيجة إليك بطريقة واضحة
                  وسهلة. لذلك يوفر النظام مكانًا واحدًا لمتابعة طلباتك والوصول
                  إلى نتائجك وتقاريرك الطبية.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "متابعة حالة الطلب خطوة بخطوة",
                    "إشعارات عند ظهور النتائج",
                    "الوصول إلى التقارير الطبية بصيغة PDF",
                    "الاحتفاظ بسجل النتائج السابقة",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-xs text-[#687576]"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5E9C91]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </AboutRevealItem>
          </AboutReveal>

          <AboutReveal>
            <AboutRevealItem>
              <div className="relative overflow-hidden rounded-2xl">
                <div className="relative h-100 sm:h-125">
                  <Image
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&q=80"
                    alt="متابعة الرعاية الطبية"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-[#263B3D]/90 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5E9C91]/15">
                      <Clock3 className="h-4 w-4 text-[#5E9C91]" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white">
                        كل شيء في مكان واحد
                      </p>
                      <p className="mt-1 text-[10px] text-white/45">
                        من الطلب وحتى التقرير النهائي
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AboutRevealItem>
          </AboutReveal>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="relative h-90 sm:h-100">
          <Image
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1400&q=80"
            alt="بيئة طبية"
            fill
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#263B3D]/90" />

          <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
            <AboutReveal>
              <AboutRevealItem>
                <div className="max-w-xl">
                  <span className="text-xs font-mono tracking-widest text-[#5E9C91]">
                    SH MEDICAL LABS
                  </span>

                  <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                    كل ما تحتاجه
                    في مكان واحد
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/55">
                    منصة متكاملة لإدارة طلبات التحاليل والنتائج، مصممة لتسهيل
                    تجربة المرضى والمختصين في كل خطوة.
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#5E9C91] px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#4E887E]"
                    >
                      استكشف المنصة
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </AboutRevealItem>
            </AboutReveal>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
