import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { books } from "../public/books";
import { useRouter } from "next/router";

export default function Home() {
  const [allItems, setAllItems] = useState(books); // 初期値を books に設定
  const [filteredItems, setFilteredItems] = useState(books); // 初期値を books に設定
  const [items, setItems] = useState(books.slice(0, 48)); // 初期表示用に先頭48件をセット
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const router = useRouter();
  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 年フィルターが変更されたときにアイテムを更新
    if (selectedYear === "All") {
      setFilteredItems(allItems);
    } else {
      const filtered = allItems.filter((book) => book.readDate.startsWith(selectedYear));
      setFilteredItems(filtered);
    }
  }, [selectedYear, allItems]);

  useEffect(() => {
    // フィルター適用後に表示アイテムをリセット
    setItems(filteredItems.slice(0, 48));
  }, [filteredItems]);

  useEffect(() => {
    // 初回ロード時にすべてのアイテムをロード
    setItems(filteredItems.slice(0, 48));
  }, []);

  useEffect(() => {
    // インターセクションオブザーバーをセットアップ
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [filteredItems]);

  const loadMore = () => {
    setItems((prevItems) => {
      if (filteredItems.length === prevItems.length) {
        return prevItems;
      }
      return [
        ...prevItems,
        ...filteredItems.slice(prevItems.length, prevItems.length + 48),
      ];
    });
  };

  const handleCardClick = (id: string) => {
    router.push(`/items/${id}`);
  };

  const handleIsbnClick = (e: any, isbn: string) => {
    e.stopPropagation();
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
          {items.map((value, index) => (
            <div key={index}>{card(value)}</div>
          ))}
          <div ref={observerTarget} className={styles.observerTarget}></div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 読書管理. All rights reserved.</p>
      </footer>
    </div>
  );
}
