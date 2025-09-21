import { type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarcode,
  faBookmark,
  faCalendarAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  onCardClick: (id: string) => void;
  onIsbnClick: (event: MouseEvent<HTMLAnchorElement>, isbn: string) => void;
}

const cardClassName =
  "group m-4 w-[400px] cursor-pointer rounded-[10px] border border-[#222] p-6 text-left text-inherit no-underline transition-colors duration-150 ease-in-out hover:border-[#0070f3] focus:border-[#0070f3] active:border-[#0070f3]";

const labelClassName =
  "inline-block w-1/5 text-gray-700 dark:text-gray-400";

const detailTextClassName = "my-1 block text-xs leading-[1.5]";

export default function BookCard({
  book,
  onCardClick,
  onIsbnClick,
}: BookCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onCardClick(book.id);
    }
  };

  const handleIsbnLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onIsbnClick(event, book.isbn);
  };

  return (
    <div
      className={cardClassName}
      onClick={() => onCardClick(book.id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${book.title}の詳細を表示。著者: ${book.author}`}
    >
      <div className="relative z-10 flex overflow-hidden rounded-lg">
        <Image
          src={book.thumbnailImage}
          alt={`${book.title}の表紙画像`}
          width={200}
          height={300}
          className="h-[320px] w-[350px] rounded-lg object-cover object-right-top transition-transform duration-500 ease-in-out group-hover:scale-108 dark:brightness-90"
        />
      </div>
      <div className="flex">
        <div className="my-4 w-full items-center">{book.title}</div>
        <div className="my-6 border-b border-[#222]" />
      </div>
      <p className={detailTextClassName}>
        <span className={labelClassName}>
          <FontAwesomeIcon icon={faUser} className="mr-[0.375rem]" />著者
        </span>
        {book.author}
      </p>
      <p className={detailTextClassName}>
        <span className={labelClassName}>
          <FontAwesomeIcon icon={faBookmark} className="mr-[0.375rem]" />出版社
        </span>
        {book.publisher}
      </p>
      <p className={detailTextClassName}>
        <span className={labelClassName}>
          <FontAwesomeIcon icon={faBarcode} className="mr-[0.375rem]" />ISBN
        </span>
        <Link
          href={`https://www.books.or.jp/book-details/${book.isbn}`}
          onClick={handleIsbnLinkClick}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {book.isbn}
        </Link>
      </p>
      <p className={detailTextClassName}>
        <span className={labelClassName}>
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-[0.375rem]" />読了日
        </span>
        {book.readDate}
      </p>
    </div>
  );
}
