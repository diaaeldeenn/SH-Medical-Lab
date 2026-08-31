"use client";
import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 15, suffix: "+", label: "سنة خبرة" },
  { value: 50, suffix: "K+", label: "مريض تمت خدمته" },
  { value: 98, suffix: "%", label: "دقة النتائج" },
  { value: 11, suffix: "+", label: "نوع تحليل متاح" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#D9E1E0]">
      {stats.map((s) => (
        <div key={s.label} className="bg-white px-6 py-8 text-center">
          <p className="text-3xl sm:text-4xl font-bold text-[#263B3D] tabular-nums">
            <Counter value={s.value} suffix={s.suffix} />
          </p>
          <p className="text-xs text-[#687576] mt-2">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
