import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { books } from "../public/books";
import { useRouter } from "next/router";

export default function Home() {
  const [allItems, setAllItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("All"); // 選択された年
  const router = useRouter();

  useEffect(() => {
    setAllItems(books);
    setFilteredItems(books);
    setItems(books.slice(0, 48));
  }, []);

  useEffect(() => {
    // Yearによる絞り込みを適用
    if (selectedYear === "All") {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(
        allItems.filter((book) => book.readDate.startsWith(selectedYear))
      );
    }
    setItems([]);
  }, [selectedYear, allItems]);

  const loadMore = async () => {
    setItems((prevItems: any[]) => {
      if (filteredItems.length === prevItems.length) {
        return prevItems;
      }
      const newItems = [
        ...prevItems,
        ...filteredItems.slice(prevItems.length, prevItems.length + 48),
      ];
      return newItems;
    });
  };

  const handleCardClick = (id: string) => {
    router.push(`/items/${id}`);
  };

  const handleIsbnClick = (e: any, isbn: string) => {
    e.stopPropagation(); // カード全体のクリックイベントを防止
  };

  const card = (value: any) => {
    return (
      <div className={styles.card} onClick={() => handleCardClick(value.id)}>
        <div className={styles.cardImg}>
          <Image
            src={value.thumnailImage}
            alt="img"
            width={200}
            height={300}
          />
        </div>
        <div>
          <p>
            <span></span>
          </p>
          <h2>{value.title}</h2>
          <div className={styles.divineLine}></div>
        </div>
        <p className={styles.author}>
          <span>著者</span>
          {value.author}
        </p>
        <p className={styles.publisher}>
          <span>出版社</span>
          {value.publisher}
        </p>
        <p className={styles.isbn}>
          <span>ISBN</span>
          <Link
            href={`https://www.books.or.jp/book-details/${value.isbn}`}
            onClick={(e) => handleIsbnClick(e, value.isbn)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value.isbn}
          </Link>
        </p>
        <p className={styles.readDate}>
          <span>読了日</span>
          {value.readDate}
        </p>
      </div>
    );
  };

  const handleYearClick = (year: string) => {
    setSelectedYear(year);
  };

  return (
    <div className={styles.container} onScroll={loadMore}>
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
        <div className={styles.filter}>
          <div className={styles.yearButtons}>
            {["All", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"].map((year) => (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                className={
                  year === selectedYear ? styles.selectedButton : styles.button
                }
              >
                {year === "All" ? "All" : year}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={items.length < filteredItems.length}
            className={styles.grid}
          >
            {items.map((value, index) => (
              <div key={index}>{card(value)}</div>
            ))}
          </InfiniteScroll>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 読書管理. All rights reserved.</p>
      </footer>
    </div>
  );
}
