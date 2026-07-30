import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_YEARS_LABEL, STORAGE_KEYS } from "@/constants/books";
import type { BookSummary } from "@/types/book";
import { deriveAvailableYears, filterBooksByYear } from "@/utils/books";
import { readSessionStorage, writeSessionStorage } from "@/utils/storage";

export function useBookFilter<T extends BookSummary>(books: T[]) {
  // sessionStorage を useState の初期化子で読むと、サーバーが描いた「All」と
  // クライアント初回描画の保存値が食い違い、ハイドレーション不一致になる。
  // 初期値は常に All にして、マウント後に一度だけ復元する。
  const [selectedYear, setSelectedYear] = useState<string>(ALL_YEARS_LABEL);
  const hasRestoredRef = useRef(false);

  const availableYears = useMemo(() => deriveAvailableYears(books), [books]);

  useEffect(() => {
    if (hasRestoredRef.current) {
      return;
    }
    hasRestoredRef.current = true;

    const storedYear = readSessionStorage(STORAGE_KEYS.selectedYear);
    if (storedYear) {
      setSelectedYear(storedYear);
    }
  }, []);

  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(ALL_YEARS_LABEL);
    }
  }, [availableYears, selectedYear]);

  useEffect(() => {
    writeSessionStorage(STORAGE_KEYS.selectedYear, selectedYear);
  }, [selectedYear]);

  const filteredBooks = useMemo(
    () => filterBooksByYear(books, selectedYear),
    [books, selectedYear],
  );

  return {
    selectedYear,
    setSelectedYear,
    filteredBooks,
    availableYears,
  };
}
