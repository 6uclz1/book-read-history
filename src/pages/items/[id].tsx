import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BookDetails, BookHighlights, MainLayout } from "@/components";
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
      <MainLayout
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
      </MainLayout>
    );
  }

  const pageDescription = `${details.title}（著者: ${details.author}）の詳細ページです。`;

  return (
    <MainLayout
      pageTitle={details.title}
      pageDescription={pageDescription}
      mainClassName="flex min-h-[50vh] flex-col items-center justify-start py-8"
    >
      <BookDetails book={details} />
      <BookHighlights
        highlights={details.highlights}
        asin={details.asin}
        bookId={details.id}
      />
      <div className="flex justify-center py-8">
        <Link
          className="rounded-md border border-[#222] px-12 py-2 hover:border-[#0070f3]"
          href="/"
        >
          戻る
        </Link>
      </div>
    </MainLayout>
  );
}
