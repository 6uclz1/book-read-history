import Link from "next/link";
import {
  type ReactNode,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Icon from "@/components/atoms/Icon/Icon";
import { books } from "@/data/books";
import {
  getHighlightRanges,
  parseSearchTerms,
  searchBooks,
} from "@/utils/search";

interface SearchDialogProps {
  onClose: () => void;
}

interface HighlightedTextProps {
  text: string;
  terms: string[];
}

const MAX_VISIBLE_RESULTS = 50;

function HighlightedText({ text, terms }: HighlightedTextProps) {
  if (terms.length === 0) {
    return text;
  }

  const ranges = getHighlightRanges(text, terms);
  const parts: ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range) => {
    if (range.start > cursor) {
      parts.push(
        <span key={`text-${cursor}`}>{text.slice(cursor, range.start)}</span>,
      );
    }
    parts.push(
      <mark
        key={`mark-${range.start}`}
        className="rounded-sm bg-yellow-200 px-0.5 text-zinc-950 dark:bg-yellow-300"
      >
        {text.slice(range.start, range.end)}
      </mark>,
    );
    cursor = range.end;
  });
  if (cursor < text.length) {
    parts.push(<span key={`text-${cursor}`}>{text.slice(cursor)}</span>);
  }

  return parts;
}

export default function SearchDialog({ onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const terms = useMemo(() => parseSearchTerms(deferredQuery), [deferredQuery]);
  const results = useMemo(
    () => searchBooks(books, deferredQuery),
    [deferredQuery],
  );
  const visibleResults = results.slice(0, MAX_VISIBLE_RESULTS);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-3 pt-[min(12vh,6rem)] sm:px-6">
      <button
        type="button"
        aria-label="検索を閉じる"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        className="relative flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-card border border-app-border bg-app-surface shadow-2xl"
      >
        <h2 id="search-dialog-title" className="sr-only">
          本を検索
        </h2>
        <div className="flex items-center gap-3 border-b border-app-border p-3 sm:p-4">
          <Icon name="search" width={22} height={22} className="shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="書名、著者、ハイライトなどを検索"
            aria-label="検索キーワード"
            className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-app-muted sm:text-lg"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="検索を閉じる"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control text-app-muted hover:bg-app-surface-subtle hover:text-app-fg"
          >
            <Icon name="close" width={22} height={22} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6">
          {terms.length === 0 ? (
            <p className="py-10 text-center text-sm text-app-muted">
              書名、著者、出版社、ISBN、読了日、ハイライトを横断検索します。
            </p>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-bold">
                「{query.trim()}」に一致する本はありません
              </p>
              <p className="mt-2 text-sm text-app-muted">
                キーワードを短くするか、別の表記をお試しください。
              </p>
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm text-app-muted" aria-live="polite">
                {results.length}冊が見つかりました
                {results.length > MAX_VISIBLE_RESULTS &&
                  `（上位${MAX_VISIBLE_RESULTS}冊を表示）`}
              </p>
              <ol className="space-y-7">
                {visibleResults.map(({ book, matches }) => (
                  <li key={book.id}>
                    <article>
                      <Link
                        href={`/items/${book.id}`}
                        onClick={onClose}
                        className="text-lg font-bold text-app-accent hover:underline"
                      >
                        <HighlightedText text={book.title} terms={terms} />
                      </Link>
                      <p className="mt-1 text-sm text-app-muted">
                        <HighlightedText text={book.author} terms={terms} />
                        <span aria-hidden="true"> · </span>
                        <HighlightedText text={book.publisher} terms={terms} />
                        <span aria-hidden="true"> · </span>
                        <HighlightedText text={book.readDate} terms={terms} />
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {matches
                          .filter((match) => match.key !== "title")
                          .map((match) => (
                            <p
                              key={match.key}
                              className="line-clamp-3 text-sm leading-6"
                            >
                              <span className="mr-2 font-bold text-app-muted">
                                {match.label}
                              </span>
                              <HighlightedText
                                text={match.snippet}
                                terms={terms}
                              />
                            </p>
                          ))}
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
