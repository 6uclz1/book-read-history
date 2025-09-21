import { type MouseEvent, forwardRef } from "react";
import BookCard from "@/components/BookCard";
import type { Book } from "@/types/book";

interface BookGridProps {
  books: Book[];
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
        <div
          className="flex flex-wrap items-center justify-center transition-transform duration-[3500ms]"
          role="grid"
          aria-label={totalBooksMessage}
        >
          {books.map((book) => (
            <div key={book.id} role="gridcell">
              <BookCard
                book={book}
                onCardClick={onCardClick}
                onIsbnClick={onIsbnClick}
              />
            </div>
          ))}
        </div>
        {hasMore && (
          <div ref={ref} aria-hidden>
            {isLoading && (
              <div aria-live="polite" aria-label="更に本を読み込み中">
                読み込み中...
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

BookGrid.displayName = "BookGrid";

export default BookGrid;
