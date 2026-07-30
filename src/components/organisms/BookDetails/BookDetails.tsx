import { BookCover, DetailProperty, IsbnLink } from "@/components";
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
          <DetailProperty icon="user" label="著者" labelClassName="font-bold">
            {book.author}
          </DetailProperty>
          <DetailProperty
            icon="bookmark"
            label="出版社"
            labelClassName="font-bold"
          >
            {book.publisher}
          </DetailProperty>
          <DetailProperty
            icon="barcode"
            label="ISBN"
            labelClassName="font-bold"
          >
            <IsbnLink isbn={book.isbn} />
          </DetailProperty>
          <DetailProperty
            icon="calendar"
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
