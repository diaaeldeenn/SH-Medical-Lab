"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TestsFiltersProps {
  initialSearch: string;
  initialCategory: string;
  categories: string[];
}

export default function TestsFilters({
  initialSearch,
  initialCategory,
  categories,
}: TestsFiltersProps) {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (search === initialSearch && category === initialCategory) {
      return;
    }

    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (category) {
      params.set("category", category);
    }

    params.set("page", "1");

    router.push(`/tests?${params.toString()}`);
  }, [search, category, initialSearch, initialCategory, router]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  return (
    <div className="bg-white border border-[#D9E1E0] rounded-xl p-4 space-y-3">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687576] pointer-events-none z-10" />

        <Input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="ابحث عن تحليل بالاسم أو الكود..."
          className="w-full pr-9 pl-4 py-2.5 text-sm bg-[#F4F7F6] border-[#D9E1E0] focus-visible:ring-[#5E9C91]"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => handleCategoryChange("")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            category === ""
              ? "bg-[#263B3D] text-white border-[#263B3D]"
              : "bg-white text-[#687576] border-[#D9E1E0] hover:border-[#263B3D] hover:text-[#20292A]"
          }`}
        >
          الكل
        </button>

        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              category === cat
                ? "bg-[#263B3D] text-white border-[#263B3D]"
                : "bg-white text-[#687576] border-[#D9E1E0] hover:border-[#263B3D] hover:text-[#20292A]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
