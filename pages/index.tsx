import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { books } from "../public/books";
import { useBookFilter } from "../hooks/useBookFilter";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import YearFilter from "../components/YearFilter";
import BookGrid from "../components/BookGrid";

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
    <div className={styles.container}>
      <Head>
        <title>読書管理</title>
        <meta name="description" content="読んだ本をリスト化したサイトです。" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://use.fontawesome.com/releases/v5.0.6/css/all.css"
          rel="stylesheet"
        />
      </Head>

      <header className={styles.header}>読書管理</header>

      <main className={styles.main}>
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

      <footer className={styles.footer}>
        <p>© 2024 読書管理. All rights reserved.</p>
      </footer>
    </div>
  );
}
