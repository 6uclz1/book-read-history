import { describe, expect, it } from "vitest";
import { ALL_YEARS_LABEL } from "@/constants/books";
import { deriveAvailableYears, filterBooksByYear } from "@/utils/books";
import type { Book } from "@/types/book";

const baseBooks: Book[] = [
  {
    id: "1",
    title: "Book One",
    author: "Author A",
    publisher: "Publisher A",
    isbn: "9780000000001",
    asin: "0000000001",
    readDate: "2024/09/01",
    thumbnailImage: "thumb-1",
    highlights: [],
  },
  {
    id: "2",
    title: "Book Two",
    author: "Author B",
    publisher: "Publisher B",
    isbn: "9780000000002",
    asin: "0000000002",
    readDate: "2023/12/15",
    thumbnailImage: "thumb-2",
    highlights: [],
  },
  {
    id: "3",
    title: "Book Three",
    author: "Author C",
    publisher: "Publisher C",
    isbn: "9780000000003",
    asin: "0000000003",
    readDate: "2023/01/10",
    thumbnailImage: "thumb-3",
    highlights: [],
  },
];

describe("deriveAvailableYears", () => {
  it("returns a descending list of unique years with the All label", () => {
    const years = deriveAvailableYears(baseBooks);
    expect(years).toEqual([ALL_YEARS_LABEL, "2024", "2023"]);
  });

  it("handles empty book lists", () => {
    expect(deriveAvailableYears([])).toEqual([ALL_YEARS_LABEL]);
  });
});

describe("filterBooksByYear", () => {
  it("returns all books when All label is provided", () => {
    const filtered = filterBooksByYear(baseBooks, ALL_YEARS_LABEL);
    expect(filtered).toHaveLength(baseBooks.length);
    expect(filtered).toEqual(baseBooks);
  });

  it("filters books by matched year", () => {
    const filtered = filterBooksByYear(baseBooks, "2023");
    expect(filtered).toHaveLength(2);
    expect(filtered.map((book) => book.id)).toEqual(["2", "3"]);
  });

  it("returns an empty array when no books match the year", () => {
    const filtered = filterBooksByYear(baseBooks, "2020");
    expect(filtered).toHaveLength(0);
  });
});
