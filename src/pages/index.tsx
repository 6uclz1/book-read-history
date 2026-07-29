import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { type MouseEvent, useCallback } from "react";
import { BookGrid, MainLayout, YearFilter } from "@/components";
import { books } from "@/data/books";
import { useBookFilter } from "@/hooks/useBookFilter";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { BookSummary } from "@/types/book";

export default function Home({
  books: bookSummaries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { selectedYear, setSelectedYear, filteredBooks, availableYears } =
    useBookFilter(bookSummaries);
  const { displayedBooks, observerTarget, hasMore, isLoading } =
    useInfiniteScroll(filteredBooks, selectedYear);

  const handleCardClick = useCallback(
    (id: string) => {
      router.push(`/items/${id}`);
    },
    [router],
  );

  const handleIsbnClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, _isbn?: string) => {
      event.stopPropagation();
    },
    [],
  );

  return (
    <MainLayout>
      <YearFilter
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        availableYears={availableYears}
      />

      <BookGrid
        books={displayedBooks}
        onCardClick={handleCardClick}
        onIsbnClick={handleIsbnClick}
        hasMore={hasMore}
        isLoading={isLoading}
        ref={observerTarget}
      />
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
