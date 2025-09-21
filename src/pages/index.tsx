import { type MouseEvent, useCallback } from "react";
import { useRouter } from "next/router";
import { BookGrid, MainLayout, YearFilter } from "@/components";
import { books } from "@/data/books";
import { useBookFilter } from "@/hooks/useBookFilter";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function Home() {
  const router = useRouter();
  const { selectedYear, setSelectedYear, filteredBooks, availableYears } =
    useBookFilter(books);
  const { displayedBooks, observerTarget, hasMore, isLoading } =
    useInfiniteScroll(filteredBooks);

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
