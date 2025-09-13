import Image from "next/image";
import Link from "next/link";
import { Book } from "../types/book";

interface BookCardProps {
  book: Book;
  onCardClick: (id: string) => void;
  onIsbnClick: (e: React.MouseEvent<HTMLAnchorElement>, isbn: string) => void;
}

export default function BookCard({
  book,
  onCardClick,
  onIsbnClick,
}: BookCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCardClick(book.id);
    }
  };

  return (
    <div
      className="group m-4 w-[400px] cursor-pointer rounded-[10px] border border-[#222] p-6 text-left text-inherit no-underline transition-colors duration-150 ease-in-out hover:border-[#0070f3] focus:border-[#0070f3] active:border-[#0070f3]"
      onClick={() => onCardClick(book.id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${book.title}の詳細を表示。著者: ${book.author}`}
    >
      <div className="relative z-10 flex overflow-hidden rounded-lg">
        <Image
          src={book.thumnailImage}
          alt={`${book.title}の表紙画像`}
          width={200}
          height={300}
          className="h-[320px] w-[350px] rounded-lg object-cover object-right-top transition-transform duration-500 ease-in-out group-hover:scale-108 dark:brightness-90"
        />
      </div>
      <div className="flex">
        <div className="my-4 w-full items-center">
          {book.title}
        </div>
        <div className="my-6 border-b border-[#222]"></div>
      </div>
      <p className="my-1 block text-xs leading-[1.5]">
        <span className="inline-block w-1/5 text-gray-700 dark:text-gray-400">
          <i className="fas fa-user mr-[0.375rem]"></i>著者
        </span>
        {book.author}
      </p>
      <p className="my-1 block text-xs leading-[1.5]">
        <span className="inline-block w-1/5 text-gray-700 dark:text-gray-400">
          <i className="fas fa-bookmark mr-[0.375rem]"></i>出版社
        </span>
        {book.publisher}
      </p>
      <p className="my-1 block text-xs leading-[1.5]">
        <span className="inline-block w-1/5 text-gray-700 dark:text-gray-400">
          <i className="fas fa-barcode mr-[0.375rem]"></i>ISBN
        </span>
        <Link
          href={`https://www.books.or.jp/book-details/${book.isbn}`}
          onClick={(e) => onIsbnClick(e, book.isbn)}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {book.isbn}
        </Link>
      </p>
      <p className="my-1 block text-xs leading-[1.5]">
        <span className="inline-block w-1/5 text-gray-700 dark:text-gray-400">
          <i className="fas fa-calendar-alt mr-[0.375rem]"></i>読了日
        </span>
        {book.readDate}
      </p>
    </div>
  );
}
