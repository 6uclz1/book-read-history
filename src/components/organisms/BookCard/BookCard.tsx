import { type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  faBarcode,
  faBookmark,
  faCalendarAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { DetailProperty } from "@/components";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  onCardClick: (id: string) => void;
  onIsbnClick: (event: MouseEvent<HTMLAnchorElement>, isbn: string) => void;
}

const cardClassName =
  "group m-4 w-[400px] cursor-pointer rounded-[10px] border border-[#222] p-6 text-left text-inherit no-underline transition-colors duration-150 ease-in-out hover:border-[#0070f3] focus:border-[#0070f3] active:border-[#0070f3]";

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
      <DetailProperty
        icon={faUser}
        label="著者"
        className="my-1 flex items-center text-xs leading-[1.5]"
      >
        {book.author}
      </DetailProperty>
      <DetailProperty
        icon={faBookmark}
        label="出版社"
        className="my-1 flex items-center text-xs leading-[1.5]"
      >
        {book.publisher}
      </DetailProperty>
      <DetailProperty
        icon={faBarcode}
        label="ISBN"
        className="my-1 flex items-center text-xs leading-[1.5]"
      >
        <Link
          href={`https://www.books.or.jp/book-details/${book.isbn}`}
          onClick={handleIsbnLinkClick}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {book.isbn}
        </Link>
      </DetailProperty>
      <DetailProperty
        icon={faCalendarAlt}
        label="読了日"
        className="my-1 flex items-center text-xs leading-[1.5]"
      >
        {book.readDate}
      </DetailProperty>
    </div>
  );
}
