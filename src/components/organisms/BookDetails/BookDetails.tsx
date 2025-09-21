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

interface BookDetailsProps {
  book: Book;
}

export default function BookDetails({ book }: BookDetailsProps) {
  return (
    <div className="my-8 flex w-full max-w-[1200px] flex-col rounded-[10px] border border-[#222] p-6 md:flex-row">
      <div className="mb-8 flex-shrink-0 md:mr-8 md:mb-0 md:basis-[350px]">
        <Image
          src={book.thumbnailImage}
          alt={book.title}
          width={350}
          height={500}
          className="h-auto w-full rounded-lg object-cover object-center dark:brightness-90 md:h-[500px] md:w-[350px]"
        />
      </div>
      <div className="flex w-full flex-col justify-center">
        <h2 className="mb-4 text-[2rem] font-bold leading-[1.15]">{book.title}</h2>
        <div className="my-6 border-b border-[#222]" />
        <DetailProperty
          icon={faUser}
          label="著者"
          className="my-1 flex items-center text-[0.9rem] leading-[1.5]"
          labelClassName="font-bold"
        >
          {book.author}
        </DetailProperty>
        <DetailProperty
          icon={faBookmark}
          label="出版社"
          className="my-1 flex items-center text-[0.9rem] leading-[1.5]"
          labelClassName="font-bold"
        >
          {book.publisher}
        </DetailProperty>
        <DetailProperty
          icon={faBarcode}
          label="ISBN"
          className="my-1 flex items-center text-[0.9rem] leading-[1.5]"
          labelClassName="font-bold"
        >
          <Link
            href={`https://www.books.or.jp/book-details/${book.isbn}`}
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
          className="my-1 flex items-center text-[0.9rem] leading-[1.5]"
          labelClassName="font-bold"
        >
          {book.readDate}
        </DetailProperty>
      </div>
    </div>
  );
}
