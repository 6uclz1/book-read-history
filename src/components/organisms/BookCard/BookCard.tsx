import Link from "next/link";
import { BookCover, DetailProperty } from "@/components";
import type { BookSummary } from "@/types/book";

interface BookCardProps {
  book: BookSummary;
}

const cardClassName =
  "group relative h-full w-full rounded-card border border-app-border bg-app-surface p-4 transition-colors duration-150 ease-in-out focus-within:border-app-accent hover:border-app-accent sm:p-6";

// カード全面をクリック可能にしつつ、内側の ISBN リンクを潰さないための
// stretched link パターン。擬似要素をカード全面に広げて当たり判定を作る。
const stretchedLinkClassName =
  "after:absolute after:inset-0 after:content-[''] hover:underline";

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className={cardClassName}>
      <BookCover
        src={book.thumbnailImage}
        width={350}
        height={466}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 350px"
        imageClassName="transition-transform duration-500 ease-in-out group-hover:scale-105 motion-reduce:transform-none dark:brightness-90"
      />
      {/* タイトルの行数がカードごとに違うとメタ情報の縦位置がずれるため高さを揃える */}
      <h2 className="my-4 line-clamp-2 min-h-[2.75rem] text-base leading-snug font-bold">
        <Link
          href={`/items/${book.id}`}
          aria-label={`${book.title}の詳細を表示`}
          className={stretchedLinkClassName}
        >
          {book.title}
        </Link>
      </h2>
      <dl className="m-0">
        <DetailProperty icon="user" label="著者">
          {book.author}
        </DetailProperty>
        <DetailProperty icon="bookmark" label="出版社">
          {book.publisher}
        </DetailProperty>
        <DetailProperty icon="barcode" label="ISBN">
          {/* stretched link の擬似要素より前面に出さないとクリックできない */}
          <Link
            href={`https://www.books.or.jp/book-details/${book.isbn}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`ISBN ${book.isbn} を books.or.jp で開く（新しいタブ）`}
            className="relative z-10 text-app-accent hover:underline"
          >
            {book.isbn}
          </Link>
        </DetailProperty>
        <DetailProperty icon="calendar" label="読了日">
          {book.readDate}
        </DetailProperty>
      </dl>
    </article>
  );
}
