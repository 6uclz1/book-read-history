import type { Book } from "@/types/book";

export interface SearchFieldMatch {
  key: string;
  label: string;
  text: string;
  snippet: string;
}

export interface BookSearchResult {
  book: Book;
  matches: SearchFieldMatch[];
}

export interface HighlightRange {
  start: number;
  end: number;
}

interface SearchableField {
  key: string;
  label: string;
  text: string;
  weight: number;
}

const SNIPPET_LENGTH = 180;
const SNIPPET_CONTEXT_BEFORE = 55;

export function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("ja-JP");
}

export function parseSearchTerms(query: string): string[] {
  return Array.from(
    new Set(
      normalizeSearchText(query)
        .split(/\s+/)
        .map((term) => term.trim())
        .filter(Boolean),
    ),
  );
}

/**
 * NFKC 正規化後の文字列で検索しながら、元の表示文字列上の範囲を返す。
 * これにより「ＫＥＮＴ」を "kent" で検索した場合も元の全角表記を保って強調できる。
 */
export function getHighlightRanges(
  text: string,
  terms: string[],
): HighlightRange[] {
  let normalizedText = "";
  const offsets: HighlightRange[] = [];

  for (let start = 0; start < text.length; ) {
    const codePoint = text.codePointAt(start);
    if (codePoint === undefined) {
      break;
    }
    const character = String.fromCodePoint(codePoint);
    const end = start + character.length;
    const normalizedCharacter = normalizeSearchText(character);
    normalizedText += normalizedCharacter;
    for (let index = 0; index < normalizedCharacter.length; index += 1) {
      offsets.push({ start, end });
    }
    start = end;
  }

  const ranges: HighlightRange[] = [];
  terms.forEach((term) => {
    let searchFrom = 0;
    while (searchFrom < normalizedText.length) {
      const hit = normalizedText.indexOf(term, searchFrom);
      if (hit < 0) {
        break;
      }
      const firstOffset = offsets[hit];
      const lastOffset = offsets[hit + term.length - 1];
      if (firstOffset && lastOffset) {
        ranges.push({ start: firstOffset.start, end: lastOffset.end });
      }
      searchFrom = hit + Math.max(term.length, 1);
    }
  });

  return ranges
    .sort((a, b) => a.start - b.start || a.end - b.end)
    .reduce<HighlightRange[]>((merged, range) => {
      const previous = merged.at(-1);
      if (previous && range.start <= previous.end) {
        previous.end = Math.max(previous.end, range.end);
      } else {
        merged.push({ ...range });
      }
      return merged;
    }, []);
}

function getSearchableFields(book: Book): SearchableField[] {
  const fields: SearchableField[] = [
    { key: "title", label: "書名", text: book.title, weight: 10 },
    { key: "author", label: "著者", text: book.author, weight: 7 },
    { key: "publisher", label: "出版社", text: book.publisher, weight: 5 },
    { key: "isbn", label: "ISBN", text: book.isbn, weight: 4 },
    { key: "asin", label: "ASIN", text: book.asin ?? "", weight: 4 },
    { key: "readDate", label: "読了日", text: book.readDate, weight: 3 },
  ];

  book.highlights.forEach((highlight, index) => {
    fields.push(
      {
        key: `highlight-${index}`,
        label: "ハイライト",
        text: highlight.text,
        weight: 2,
      },
      {
        key: `location-${index}`,
        label: "位置",
        text: highlight.location,
        weight: 1,
      },
    );
  });

  return fields.filter((field) => field.text.trim().length > 0);
}

export function createSearchSnippet(text: string, terms: string[]): string {
  const normalized = normalizeSearchText(text);
  const hitIndexes = terms
    .map((term) => normalized.indexOf(term))
    .filter((index) => index >= 0);
  const firstHit = hitIndexes.length > 0 ? Math.min(...hitIndexes) : 0;
  const start = Math.max(0, firstHit - SNIPPET_CONTEXT_BEFORE);
  const end = Math.min(text.length, start + SNIPPET_LENGTH);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";

  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

export function searchBooks(books: Book[], query: string): BookSearchResult[] {
  const terms = parseSearchTerms(query);
  if (terms.length === 0) {
    return [];
  }

  return books
    .map((book) => {
      const fields = getSearchableFields(book);
      const searchableText = normalizeSearchText(
        fields.map((field) => field.text).join("\n"),
      );

      // 空白区切りの語がすべて、書籍内のいずれかの項目に存在する本を返す。
      if (!terms.every((term) => searchableText.includes(term))) {
        return null;
      }

      const matchingFields = fields.filter((field) => {
        const normalized = normalizeSearchText(field.text);
        return terms.some((term) => normalized.includes(term));
      });
      const score = matchingFields.reduce((total, field) => {
        const normalized = normalizeSearchText(field.text);
        const hitCount = terms.filter((term) =>
          normalized.includes(term),
        ).length;
        const exactBonus = terms.some((term) => normalized === term) ? 20 : 0;
        return total + field.weight * hitCount + exactBonus;
      }, 0);
      const matches = matchingFields.slice(0, 3).map((field) => ({
        key: field.key,
        label: field.label,
        text: field.text,
        snippet: createSearchSnippet(field.text, terms),
      }));

      return { book, matches, score };
    })
    .filter(
      (
        result,
      ): result is BookSearchResult & {
        score: number;
      } => result !== null,
    )
    .sort((a, b) => b.score - a.score)
    .map(({ book, matches }) => ({ book, matches }));
}
