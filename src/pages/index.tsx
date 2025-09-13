import Head from "next/head";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { books } from "../../public/books";
import { useBookFilter } from "@/hooks/useBookFilter";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import YearFilter from "@/components/YearFilter";
import BookGrid from "@/components/BookGrid";

export default function Home() {
  const router = useRouter();

  // カスタムフックを使用してビジネスロジックを分離
  const { selectedYear, setSelectedYear, filteredBooks, availableYears } =
    useBookFilter(books);
  const { displayedBooks, observerTarget, hasMore, isLoading } =
    useInfiniteScroll(filteredBooks);

  const handleCardClick = (id: string) => {
    router.push(`/items/${id}`);
  };

  const handleIsbnClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    isbn: string,
  ) => {
    e.stopPropagation();
  };

  return (
    <div className="px-8">
      <Head>
        <title>読書管理</title>
        <meta name="description" content="読んだ本をリスト化したサイトです。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex items-center border-b border-[#222] py-4 text-2xl font-bold">
        <FontAwesomeIcon icon={faBookmark} className="mr-[1.125rem]" />読書管理
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center py-8">
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
      </main>

      <footer className="flex flex-1 items-center justify-center border-t border-[#222] py-8">
        <p>© 2024 読書管理. All rights reserved.</p>
      </footer>
    </div>
  );
}
