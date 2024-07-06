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
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    setAllItems(books);
    setItems(books.slice(0, 48));
  }, []);

  const loadMore = async () => {
    setItems((prevItems: any[]) => {
      if (allItems.length === prevItems.length) {
        return prevItems;
      }
      const newItems = [
        ...prevItems,
        ...allItems.slice(prevItems.length, prevItems.length + 48),
      ];
      return newItems;
    });
  };

  const handleCardClick = (id: string) => {
    router.push(`/items/${id}`);
  };

  const handleIsbnClick = (e: React.MouseEvent<HTMLAnchorElement>, isbn: string) => {
    e.stopPropagation(); // これにより、カード全体のクリックイベントが発火するのを防ぎます
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
        <div className={styles.grid}>
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={true}
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