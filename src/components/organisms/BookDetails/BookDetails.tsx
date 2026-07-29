import {
  faBarcode,
  faBookmark,
  faCalendarAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { BookCover, DetailProperty } from "@/components";
import type { Book } from "@/types/book";

interface BookDetailsProps {
  book: Book;
}

export default function BookDetails({ book }: BookDetailsProps) {
  return (
    <div className="my-8 flex w-full max-w-[1200px] flex-col rounded-card border border-app-border bg-app-surface p-6 md:flex-row">
      <div className="mb-8 flex-shrink-0 md:mr-8 md:mb-0 md:basis-[350px]">
        <BookCover
          src={book.thumbnailImage}
          width={350}
          height={500}
          frameClassName="md:w-[350px]"
          imageClassName="dark:brightness-90"
        />
      </div>
      <div className="flex w-full flex-col justify-center">
        <h1 className="mb-4 text-[2rem] font-bold leading-[1.15]">
          {book.title}
        </h1>
        <div className="my-6 border-b border-app-border" />
        <dl className="m-0">
          <DetailProperty icon={faUser} label="著者" labelClassName="font-bold">
            {book.author}
          </DetailProperty>
          <DetailProperty
            icon={faBookmark}
            label="出版社"
            labelClassName="font-bold"
          >
            {book.publisher}
          </DetailProperty>
          <DetailProperty
            icon={faBarcode}
            label="ISBN"
            labelClassName="font-bold"
          >
            <Link
              href={`https://www.books.or.jp/book-details/${book.isbn}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`ISBN ${book.isbn} を books.or.jp で開く（新しいタブ）`}
              className="text-app-accent hover:underline"
            >
              {book.isbn}
            </Link>
          </DetailProperty>
          <DetailProperty
            icon={faCalendarAlt}
            label="読了日"
            labelClassName="font-bold"
          >
            {book.readDate}
          </DetailProperty>
        </dl>
      </div>
    </div>
  );
}
