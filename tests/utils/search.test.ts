import { describe, expect, it } from "vitest";
import type { Book } from "@/types/book";
import {
  createSearchSnippet,
  getHighlightRanges,
  normalizeSearchText,
  parseSearchTerms,
  searchBooks,
} from "@/utils/search";

const books: Book[] = [
  {
    id: "1",
    title: "三体",
    author: "劉 慈欣",
    publisher: "早川書房",
    isbn: "9784152098702",
    asin: "4152098708",
    readDate: "2024/01/02",
    thumbnailImage: "",
    highlights: [{ text: "文明は宇宙で孤独ではない。", location: "123" }],
  },
  {
    id: "2",
    title: "テスト駆動開発",
    author: "Kent Beck",
    publisher: "オーム社",
    isbn: "9784274217883",
    asin: null,
    readDate: "2023/12/01",
    thumbnailImage: "",
    highlights: [],
  },
];

describe("book search", () => {
  it("normalizes width, case, and duplicate terms", () => {
    expect(normalizeSearchText("ＫＥＮＴ")).toBe("kent");
    expect(parseSearchTerms(" Kent  KENT  Beck ")).toEqual(["kent", "beck"]);
  });

  it("maps normalized matches back to the original display text", () => {
    expect(getHighlightRanges("著者 ＫＥＮＴ Beck", ["kent", "beck"])).toEqual([
      { start: 3, end: 7 },
      { start: 8, end: 12 },
    ]);
  });

  it("merges overlapping highlight ranges", () => {
    expect(getHighlightRanges("testing", ["test", "testing"])).toEqual([
      { start: 0, end: 7 },
    ]);
  });

  it("searches across different fields and requires every term", () => {
    expect(
      searchBooks(books, "劉 宇宙").map((result) => result.book.id),
    ).toEqual(["1"]);
    expect(searchBooks(books, "早川 オーム社")).toEqual([]);
  });

  it("returns no results for an empty query", () => {
    expect(searchBooks(books, "   ")).toEqual([]);
  });

  it("ranks exact and multiple book matches", () => {
    expect(searchBooks(books, "三体")[0].book.id).toBe("1");
    expect(searchBooks(books, "202").map((result) => result.book.id)).toEqual([
      "1",
      "2",
    ]);
  });

  it("returns one result per book with matching snippets", () => {
    const [result] = searchBooks(books, "宇宙");
    expect(result.book.title).toBe("三体");
    expect(result.matches).toEqual([
      expect.objectContaining({
        label: "ハイライト",
        snippet: expect.stringContaining("宇宙"),
      }),
    ]);
  });

  it("trims long text around the first match", () => {
    const text = `${"前".repeat(100)}検索語${"後".repeat(200)}`;
    const snippet = createSearchSnippet(text, ["検索語"]);
    expect(snippet).toContain("検索語");
    expect(snippet.startsWith("…")).toBe(true);
    expect(snippet.endsWith("…")).toBe(true);
    expect(snippet.length).toBeLessThanOrEqual(182);
  });

  it("uses the beginning when no snippet term matches", () => {
    expect(createSearchSnippet("short text", ["missing"])).toBe("short text");
  });
});
