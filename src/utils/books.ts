import { ALL_YEARS_LABEL } from "@/constants/books";
import type { BookSummary } from "@/types/book";

const DATE_DELIMITER = "/";

export function deriveAvailableYears(books: BookSummary[]): string[] {
  const years = new Set<string>();

  books.forEach((book) => {
    const [year] = book.readDate.split(DATE_DELIMITER);
    if (year) {
      years.add(year);
    }
  });

  const sortedYears = Array.from(years).sort((a, b) => b.localeCompare(a));
  return [ALL_YEARS_LABEL, ...sortedYears];
}

export function filterBooksByYear<T extends BookSummary>(
  books: T[],
  year: string,
): T[] {
  if (year === ALL_YEARS_LABEL) {
    return books;
  }

  return books.filter((book) => {
    const [readYear] = book.readDate.split(DATE_DELIMITER);
    return readYear === year;
  });
}
