import {
  faBarcode,
  faBookmark,
  faCalendarAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { DetailProperty } from "@/components";
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
      <div className="relative flex overflow-hidden rounded-lg">
        <Image
          src={book.thumbnailImage}
          // 書名は直後の見出しで読み上げられるため、表紙画像は装飾扱いにする
          alt=""
          width={350}
          height={320}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 350px"
          className="h-[320px] w-full rounded-lg object-cover object-right-top transition-transform duration-500 ease-in-out group-hover:scale-108 dark:brightness-90"
        />
      </div>
      <h2 className="my-4 text-base leading-snug font-bold">
        <Link
          href={`/items/${book.id}`}
          aria-label={`${book.title}の詳細を表示`}
          className={stretchedLinkClassName}
        >
          {book.title}
        </Link>
      </h2>
      <DetailProperty
        icon={faUser}
        label="著者"
        className="my-1 flex items-center text-sm leading-[1.5]"
      >
        {book.author}
      </DetailProperty>
      <DetailProperty
        icon={faBookmark}
        label="出版社"
        className="my-1 flex items-center text-sm leading-[1.5]"
      >
        {book.publisher}
      </DetailProperty>
      <DetailProperty
        icon={faBarcode}
        label="ISBN"
        className="my-1 flex items-center text-sm leading-[1.5]"
      >
        {/* stretched link の擬似要素より前面に出さないとクリックできない */}
        <Link
          href={`https://www.books.or.jp/book-details/${book.isbn}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`ISBN ${book.isbn} を books.or.jp で開く（新しいタブ）`}
          className="relative z-10 hover:underline"
        >
          {book.isbn}
        </Link>
      </DetailProperty>
      <DetailProperty
        icon={faCalendarAlt}
        label="読了日"
        className="my-1 flex items-center text-sm leading-[1.5]"
      >
        {book.readDate}
      </DetailProperty>
    </article>
  );
}
