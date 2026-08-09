import { forwardRef } from "react";
import { BookCard, Icon } from "@/components";
import type { BookSummary } from "@/types/book";

interface BookGridProps {
  books: BookSummary[];
  /** 絞り込み後の総数。books は無限スクロールで読み込み済みの分だけを持つ。 */
  totalCount: number;
  hasMore?: boolean;
  isLoading?: boolean;
}

const BookGrid = forwardRef<HTMLDivElement, BookGridProps>(
  ({ books, totalCount, hasMore = false, isLoading = false }, ref) => {
    if (totalCount === 0) {
      return (
        <div className="flex flex-col items-center gap-3 py-16 text-app-muted">
          <Icon name="bookOpen" width="2em" height="2em" />
          <p>この条件で読んだ本はまだありません。</p>
        </div>
      );
    }

    return (
      <div className="w-full">
        <ul className="mx-auto grid w-full max-w-[1400px] list-none grid-cols-2 justify-items-center gap-3 p-0 sm:gap-6 xl:grid-cols-3">
          {books.map((book) => (
            <li key={book.id} className="w-full max-w-[400px]">
              <BookCard book={book} />
            </li>
          ))}
        </ul>
        {/* 監視用センチネルは支援技術から隠すが、読み込み状態の通知は隠してはいけない */}
        {hasMore && <div ref={ref} aria-hidden />}
        <div
          className="py-4 text-center text-sm text-app-muted"
          aria-live="polite"
        >
          {isLoading ? "読み込み中..." : ""}
        </div>
      </div>
    );
  },
);

BookGrid.displayName = "BookGrid";

export default BookGrid;
