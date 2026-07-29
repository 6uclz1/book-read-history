import type { GetStaticProps, InferGetStaticPropsType } from "next";
import {
  BackToTopButton,
  BookGrid,
  MainLayout,
  YearFilter,
} from "@/components";
import { books } from "@/data/books";
import { useBookFilter } from "@/hooks/useBookFilter";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { BookSummary } from "@/types/book";

export default function Home({
  books: bookSummaries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { selectedYear, setSelectedYear, filteredBooks, availableYears } =
    useBookFilter(bookSummaries);
  const { displayedBooks, observerTarget, hasMore, isLoading } =
    useInfiniteScroll(filteredBooks, selectedYear);

  return (
    <MainLayout>
      {/*
       * ヘッダーのサイト名と内容が重複するため視覚的には出さない。
       * ただし h1 が無いと見出しジャンプの起点が消えるので、
       * 支援技術には見える sr-only として残す。
       */}
      <h1 className="sr-only">読書記録</h1>

      <YearFilter
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        availableYears={availableYears}
      />

      <BookGrid
        books={displayedBooks}
        totalCount={filteredBooks.length}
        hasMore={hasMore}
        isLoading={isLoading}
        ref={observerTarget}
      />

      <BackToTopButton />
    </MainLayout>
  );
}

// 一覧ではハイライト本文を一切使わないため、ビルド時に切り落とす。
// これを直接importすると全ハイライト（データ全体の約6割）が
// クライアントバンドルに載ってしまう。
export const getStaticProps: GetStaticProps<{
  books: BookSummary[];
}> = async () => {
  const summaries = books.map(
    ({ highlights: _highlights, ...summary }): BookSummary => summary,
  );

  return {
    props: {
      books: summaries,
    },
  };
};
