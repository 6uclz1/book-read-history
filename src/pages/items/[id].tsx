import { ReactNode, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBarcode,
  faBookmark,
  faCalendarAlt,
  faExternalLinkAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "@/components/Layout";
import { books } from "@/data/books";
import type { Book } from "@/types/book";

const NOT_FOUND_TITLE = "Book not found";
const NOT_FOUND_DESCRIPTION = "指定された本が見つかりませんでした。";

export default function DetailPage() {
  const router = useRouter();
  const rawId = router.query.id;
  const bookId = Array.isArray(rawId) ? rawId[0] : rawId;

  const details: Book | undefined = useMemo(
    () => books.find((book) => book.id === bookId),
    [bookId],
  );

  if (!details) {
    return (
      <Layout
        pageTitle={NOT_FOUND_TITLE}
        pageDescription={NOT_FOUND_DESCRIPTION}
        mainClassName="flex min-h-[50vh] flex-col items-center justify-center py-8"
      >
        <p className="text-center text-lg text-gray-400">Book not found</p>
        <Link
          className="mt-6 rounded-md border border-[#222] px-12 py-2 hover:border-[#0070f3]"
          href="/"
        >
          戻る
        </Link>
      </Layout>
    );
  }

  const pageDescription = `${details.title}（著者: ${details.author}）の詳細ページです。`;

  return (
    <Layout
      pageTitle={details.title}
      pageDescription={pageDescription}
      mainClassName="flex min-h-[50vh] flex-col items-center justify-start py-8"
    >
      <div className="my-8 flex w-full max-w-[1200px] flex-col rounded-[10px] border border-[#222] p-6 md:flex-row">
        <div className="mb-8 flex-shrink-0 md:mr-8 md:mb-0 md:basis-[350px]">
          <Image
            src={details.thumbnailImage}
            alt={details.title}
            width={350}
            height={500}
            className="h-auto w-full rounded-lg object-cover object-center dark:brightness-90 md:h-[500px] md:w-[350px]"
          />
        </div>
        <div className="flex w-full flex-col justify-center">
          <h2 className="mb-4 text-[2rem] font-bold leading-[1.15]">
            {details.title}
          </h2>
          <div className="my-6 border-b border-[#222]" />
          <DetailRow icon={faUser} label="著者">
            {details.author}
          </DetailRow>
          <DetailRow icon={faBookmark} label="出版社">
            {details.publisher}
          </DetailRow>
          <DetailRow icon={faBarcode} label="ISBN">
            <Link
              href={`https://www.books.or.jp/book-details/${details.isbn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {details.isbn}
            </Link>
          </DetailRow>
          <DetailRow icon={faCalendarAlt} label="読了日">
            {details.readDate}
          </DetailRow>
        </div>
      </div>

      {details.highlights.length > 0 && (
        <div className="my-8 w-full max-w-[1200px] rounded-lg border border-[#222] p-6 text-gray-800">
          <h3 className="mb-4 flex items-center border-b border-[#222] pb-2 text-base font-bold text-gray-300">
            ハイライト
          </h3>
          <ul className="list-none p-0">
            {details.highlights.map((highlight, index) => (
              <li
                key={`${details.id}-highlight-${index}`}
                className="border-b border-[#222] py-4 leading-snug text-gray-400 last:border-b-0"
              >
                <p>{highlight.text}</p>
                {details.asin && (
                  <a
                    href={`kindle://book?action=open&asin=${details.asin}&location=${highlight.location}`}
                    className="mt-2 inline-block text-sm hover:underline"
                    style={{ display: "block", textAlign: "right" }}
                  >
                    Location. {highlight.location}
                    <span className="ml-[6px]">
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center py-8">
        <Link
          className="rounded-md border border-[#222] px-12 py-2 hover:border-[#0070f3]"
          href="/"
        >
          戻る
        </Link>
      </div>
    </Layout>
  );
}

interface DetailRowProps {
  icon: IconDefinition;
  label: string;
  children: ReactNode;
}

function DetailRow({ icon, label, children }: DetailRowProps) {
  return (
    <p className="my-1 flex items-center text-[0.9rem] leading-[1.5]">
      <span className="inline-block w-1/5 font-bold text-gray-700 dark:text-gray-400">
        <FontAwesomeIcon icon={icon} className="mr-[0.45rem]" />
        {label}
      </span>
      {children}
    </p>
  );
}
