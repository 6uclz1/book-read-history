import { forwardRef, type MouseEvent } from "react";
import { BookCard } from "@/components";
import type { BookSummary } from "@/types/book";

interface BookGridProps {
  books: BookSummary[];
  onCardClick: (id: string) => void;
  onIsbnClick: (event: MouseEvent<HTMLAnchorElement>, isbn: string) => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

const BookGrid = forwardRef<HTMLDivElement, BookGridProps>(
  (
    { books, onCardClick, onIsbnClick, hasMore = false, isLoading = false },
    ref,
  ) => {
    const totalBooksMessage = `${books.length}冊の本を表示中`;

    return (
      <div>
        <ul
          className="mx-auto grid w-full max-w-[1400px] list-none grid-cols-1 justify-items-center gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3"
          aria-label={totalBooksMessage}
        >
          {books.map((book) => (
            <li key={book.id} className="w-full max-w-[400px]">
              <BookCard
                book={book}
                onCardClick={onCardClick}
                onIsbnClick={onIsbnClick}
              />
            </li>
          ))}
        </ul>
        {/* 監視用センチネルは支援技術から隠すが、読み込み状態の通知は隠してはいけない */}
        {hasMore && <div ref={ref} aria-hidden />}
        <div aria-live="polite">{isLoading ? "読み込み中..." : ""}</div>
      </div>
    );
  },
);

BookGrid.displayName = "BookGrid";

export default BookGrid;
