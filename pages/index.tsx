import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { books } from "../public/books";

export default function Home() {
  const [allItems, setAllItems] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

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

  const card = (value: any) => {
    return (
      <div className={styles.card}>
        <div className={styles.cardImg}>
          <Image
            src={value.thumnailImage}
            alt="img"
            width={200}
            height={300}
          ></Image>
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
            href={"https://www.books.or.jp/book-details/" + value.isbn}
            target={"_blank"}
            style={{ textDecoration: "underline" }}
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
      <link
        href="https://use.fontawesome.com/releases/v5.0.6/css/all.css"
        rel="stylesheet"
      ></link>
      <Head>
        <title>読書管理</title>
        <meta name="description" content="読んだ本をリスト化したサイトです。" />
        <link rel="icon" href="/favicon.ico" />
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

      <footer className={styles.footer}>Created by {"6uclz1"}.</footer>
    </div>
  );
}
