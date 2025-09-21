import { useEffect, useMemo, useState } from "react";
import { ALL_YEARS_LABEL, STORAGE_KEYS } from "@/constants/books";
import { Book } from "@/types/book";
import { deriveAvailableYears, filterBooksByYear } from "@/utils/books";
import { readSessionStorage, writeSessionStorage } from "@/utils/storage";

export function useBookFilter(books: Book[]) {
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    return readSessionStorage(STORAGE_KEYS.selectedYear) ?? ALL_YEARS_LABEL;
  });

  const availableYears = useMemo(() => deriveAvailableYears(books), [books]);

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
