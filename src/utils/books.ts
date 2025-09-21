import { ALL_YEARS_LABEL } from "@/constants/books";
import { Book } from "@/types/book";

const YEAR_INDEX = 0;
const DATE_DELIMITER = "/";

export function deriveAvailableYears(books: Book[]): string[] {
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

export function filterBooksByYear(books: Book[], year: string): Book[] {
  if (year === ALL_YEARS_LABEL) {
    return books;
  }

  return books.filter((book) => {
    const [readYear] = book.readDate.split(DATE_DELIMITER);
    return readYear === year;
  });
}
