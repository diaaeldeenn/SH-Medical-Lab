"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, CheckCircle2, Circle, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TestI } from "@/interfaces/test.interface";
import { getTests } from "@/service/test.api";

interface Props {
  selectedTests: TestI[];
  onToggleTest: (test: TestI) => void;
  onNext: () => void;
}

export default function TestsStep({
  selectedTests,
  onToggleTest,
  onNext,
}: Props) {
  const [tests, setTests] = useState<TestI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const categories = Array.from(new Set(tests.map((test) => test.category)));

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTests(page, 12, search, category);
      setTests(res.data?.data || []);
      setTotalPages(res.data?.meta?.totalPages || 1);
    } catch {
      setError("تعذّر تحميل التحاليل، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setPage(1);
  };

  const isSelected = (id: string) => selectedTests.some((t) => t._id === id);

  const total = selectedTests.reduce((sum, t) => sum + t.price, 0);

  return (
    <div>
      <div className="p-6 border-b border-[#D9E1E0]">
        <h2 className="text-base font-semibold text-[#20292A] mb-4">
          اختر التحاليل المطلوبة
        </h2>
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687576]" />
          <input
            type="text"
            placeholder="ابحث عن تحليل..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-[#D9E1E0] bg-[#F4F7F6] rounded-none pr-9 pl-4 py-2.5 text-sm text-[#20292A] placeholder:text-[#687576] outline-none focus:border-[#5E9C91]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              category === ""
                ? "bg-[#263B3D] text-white border-[#263B3D]"
                : "bg-white text-[#687576] border-[#D9E1E0] hover:border-[#263B3D] hover:text-[#20292A]"
            }`}
          >
            الكل
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
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

      <div className="p-6 min-h-80">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-[#263B3D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <FlaskConical className="w-8 h-8 text-[#D9E1E0]" />
            <p className="text-sm text-[#687576]">{error}</p>
            <button
              onClick={fetchTests}
              className="text-xs text-[#5E9C91] underline underline-offset-2"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <FlaskConical className="w-8 h-8 text-[#D9E1E0]" />
            <p className="text-sm text-[#687576]">لا توجد تحاليل مطابقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tests.map((test) => {
              const selected = isSelected(test._id);
              return (
                <button
                  key={test._id}
                  onClick={() => onToggleTest(test)}
                  className={`w-full text-right p-4 border transition-all flex items-start gap-3 ${
                    selected
                      ? "border-[#5E9C91] bg-[#5E9C91]/5"
                      : "border-[#D9E1E0] bg-white hover:border-[#263B3D]"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {selected ? (
                      <CheckCircle2 className="w-4 h-4 text-[#5E9C91]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#D9E1E0]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#20292A] leading-snug">
                      {test.nameAr}
                    </p>
                    <p className="text-xs text-[#687576] mt-0.5">
                      {test.medicalName}
                    </p>
                    <p className="text-xs font-bold text-[#5E9C91] mt-2">
                      {test.price} جنيه
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-6 pb-4 flex items-center gap-2 justify-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-xs border border-[#D9E1E0] disabled:opacity-40 hover:border-[#263B3D] text-[#20292A]"
          >
            السابق
          </button>
          <span className="text-xs text-[#687576]">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-xs border border-[#D9E1E0] disabled:opacity-40 hover:border-[#263B3D] text-[#20292A]"
          >
            التالي
          </button>
        </div>
      )}

      <div className="px-6 py-4 border-t border-[#D9E1E0] flex items-center justify-between bg-[#F4F7F6]">
        <div className="flex items-center gap-2">
          {selectedTests.length > 0 && (
            <>
              <Badge className="bg-[#263B3D] text-white text-xs rounded-none px-2 py-0.5 font-medium">
                {selectedTests.length} تحليل
              </Badge>
              <span className="text-sm font-bold text-[#20292A]">
                {total} جنيه
              </span>
            </>
          )}
          {selectedTests.length === 0 && (
            <span className="text-sm text-[#687576]">لم تختر أي تحليل بعد</span>
          )}
        </div>
        <button
          disabled={selectedTests.length === 0}
          onClick={onNext}
          className="px-5 py-2.5 bg-[#263B3D] text-white text-sm font-medium disabled:opacity-40 hover:bg-[#1E3032] transition-colors"
        >
          التالي
        </button>
      </div>
    </div>
  );
}
