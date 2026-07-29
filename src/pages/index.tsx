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
      {/* ページ内に h1 が存在しないと見出しジャンプの起点がなくなる */}
      <h1 className="mb-6 text-center text-2xl font-bold">読書記録</h1>

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
