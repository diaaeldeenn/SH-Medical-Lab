"use client";

interface TestsMarqueeProps {
  items: string[];
}

export default function TestsMarquee({ items }: TestsMarqueeProps) {
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-[#D9E1E0] bg-[#F4F7F6] py-3 select-none">
      <div className="flex gap-8 animate-marquee whitespace-nowrap w-max">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-xs text-[#687576]"
          >
            <span className="w-1 h-1 rounded-full bg-[#5E9C91] inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
