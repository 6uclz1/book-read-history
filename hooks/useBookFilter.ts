import { useState, useEffect, useMemo } from 'react';
import { Book } from '../types/book';

export function useBookFilter(books: Book[]) {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  // 利用可能な年を動的に生成
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    books.forEach(book => {
      const year = book.readDate.split('/')[0];
      years.add(year);
    });
    return ['All', ...Array.from(years).sort((a, b) => b.localeCompare(a))];
  }, [books]);

  useEffect(() => {
    const filtered =
      selectedYear === 'All'
        ? books
        : books.filter(book => book.readDate.startsWith(selectedYear));
    setFilteredBooks(filtered);
  }, [selectedYear, books]);

  return {
    selectedYear,
    setSelectedYear,
    filteredBooks,
    availableYears,
  };
}
