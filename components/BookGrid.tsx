import { forwardRef } from "react";
import { Book } from "../types/book";
import BookCard from "./BookCard";
import styles from "../styles/Home.module.css";

interface BookGridProps {
  books: Book[];
  onCardClick: (id: string) => void;
  onIsbnClick: (e: React.MouseEvent<HTMLAnchorElement>, isbn: string) => void;
}

const BookGrid = forwardRef<HTMLDivElement, BookGridProps>(
  ({ books, onCardClick, onIsbnClick }, ref) => {
    return (
      <div className={styles.grid}>
        {books.map((book, index) => (
          <div key={index}>
            <BookCard
              book={book}
              onCardClick={onCardClick}
              onIsbnClick={onIsbnClick}
            />
          </div>
        ))}
        <div ref={ref} className={styles.observerTarget}></div>
      </div>
    );
  }
);

BookGrid.displayName = "BookGrid";

export default BookGrid;