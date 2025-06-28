import Image from "next/image";
import Link from "next/link";
import { Book } from "../types/book";
import styles from "../styles/Home.module.css";

interface BookCardProps {
  book: Book;
  onCardClick: (id: string) => void;
  onIsbnClick: (e: React.MouseEvent<HTMLAnchorElement>, isbn: string) => void;
}

export default function BookCard({ book, onCardClick, onIsbnClick }: BookCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCardClick(book.id);
    }
  };

  return (
    <div 
      className={styles.card} 
      onClick={() => onCardClick(book.id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${book.title}の詳細を表示。著者: ${book.author}`}
    >
      <div className={styles.cardImg}>
        <Image
          src={book.thumnailImage}
          alt={`${book.title}の表紙画像`}
          width={200}
          height={300}
        />
      </div>
      <div>
        <p>
          <span></span>
        </p>
        <h2>{book.title}</h2>
        <div className={styles.divineLine}></div>
      </div>
      <p className={styles.author}>
        <span>著者</span>
        {book.author}
      </p>
      <p className={styles.publisher}>
        <span>出版社</span>
        {book.publisher}
      </p>
      <p className={styles.isbn}>
        <span>ISBN</span>
        <Link
          href={`https://www.books.or.jp/book-details/${book.isbn}`}
          onClick={(e) => onIsbnClick(e, book.isbn)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {book.isbn}
        </Link>
      </p>
      <p className={styles.readDate}>
        <span>読了日</span>
        {book.readDate}
      </p>
    </div>
  );
}