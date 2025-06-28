import { forwardRef } from 'react';
import { Book } from '../types/book';
import BookCard from './BookCard';
import styles from '../styles/Home.module.css';

interface BookGridProps {
  books: Book[];
  onCardClick: (id: string) => void;
  onIsbnClick: (e: React.MouseEvent<HTMLAnchorElement>, isbn: string) => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

const BookGrid = forwardRef<HTMLDivElement, BookGridProps>(
  (
    { books, onCardClick, onIsbnClick, hasMore = false, isLoading = false },
    ref
  ) => {
    return (
      <div>
        <div
          className={styles.grid}
          role="grid"
          aria-label={`${books.length}冊の本を表示中`}
        >
          {books.map((book, index) => (
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
          <div ref={ref} className={styles.observerTarget}>
            {isLoading && (
              <div aria-live="polite" aria-label="更に本を読み込み中">
                読み込み中...
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

BookGrid.displayName = 'BookGrid';

export default BookGrid;
