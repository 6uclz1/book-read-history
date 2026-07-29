import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef } from "react";
import { BookCard } from "@/components";
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
    // 件数は ul の aria-label に隠されていて晴眼者に見えず、しかも
    // 読み込み済みの件数しか数えていなかった。可視テキストとして出す。
    const countMessage = `全${totalCount}冊中 ${books.length}冊を表示中`;

    if (totalCount === 0) {
      return (
        <div className="flex flex-col items-center gap-3 py-16 text-app-muted">
          <FontAwesomeIcon icon={faBookOpen} size="2x" aria-hidden />
          <p>この条件で読んだ本はまだありません。</p>
        </div>
      );
    }

    return (
      <div className="w-full">
        {/* 読み込みのたびに読み上げると煩いため、ここは live region にしない。
            追加読み込みの通知は下の読み込み中メッセージが担う。 */}
        <p className="mb-4 text-center text-sm text-app-muted">
          {countMessage}
        </p>
        <ul className="mx-auto grid w-full max-w-[1400px] list-none grid-cols-1 justify-items-center gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
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
