import { ALL_YEARS_LABEL } from "@/constants/books";
import type { BookSummary } from "@/types/book";

const DATE_DELIMITER = "/";
const BOOKS_OR_JP_BASE_URL = "https://www.books.or.jp/book-details";

/**
 * ISBN の書誌ページ URL。ISBN を持たない本（電子書籍のみの巻など）が
 * 実データに存在し、そのままだと `/book-details/` という壊れたリンクになる。
 * 参照先が作れないときは null を返し、呼び出し側でリンク自体を出さない。
 */
export function buildIsbnUrl(isbn: string | null | undefined): string | null {
  const trimmed = isbn?.trim();
  if (!trimmed) {
    return null;
  }

  return `${BOOKS_OR_JP_BASE_URL}/${encodeURIComponent(trimmed)}`;
}

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
