import { useRouter } from "next/router";
import { books } from "../../../public/books";
import { Book } from "@/types/book";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import styles from "@/styles/Detail.module.css";

function DetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const details: Book | undefined = books.find((book: Book) => book.id === id);

  if (!details) {
    return <div className={styles.container}>Book not found</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {details
            ? `読書管理 | ${details.title}`
            : "読書管理 | Book not found"}
        </title>
        <meta
          name="description"
          content={
            details
              ? `${details.title}（著者: ${details.author}）の詳細ページです。`
              : "指定された本が見つかりませんでした。"
          }
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://use.fontawesome.com/releases/v5.0.6/css/all.css"
          rel="stylesheet"
        />
      </Head>

      <header className={styles.header}>
        <span>読書管理</span>
      </header>

      <main className={styles.main}>
        <div className={styles.bookDetail}>
          <div className={styles.imageContainer}>
            <Image
              src={details.thumnailImage}
              alt={details.title}
              width={350}
              height={500}
              className={styles.bookImage}
            />
          </div>
          <div className={styles.infoContainer}>
            <h2 className={styles.title}>{details.title}</h2>
            <div className={styles.divineLine}></div>
            <p className={`${styles.infoItem} ${styles.author}`}>
              <span>著者</span> {details.author}
            </p>
            <p className={`${styles.infoItem} ${styles.publisher}`}>
              <span>出版社</span> {details.publisher}
            </p>
            <p className={`${styles.infoItem} ${styles.isbn}`}>
              <span>ISBN</span>
              <Link
                href={`https://www.books.or.jp/book-details/${details.isbn}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {details.isbn}
              </Link>
            </p>
            <p className={`${styles.infoItem} ${styles.readDate}`}>
              <span>読了日</span> {details.readDate}
            </p>
          </div>
        </div>

        {details.highlights && details.highlights.length > 0 && (
          <div className={styles.highlightsSection}>
            <h3 className={styles.highlightsTitle}>ハイライト</h3>
            <ul className={styles.highlightsList}>
              {details.highlights.map((highlight, index) => (
                <li key={index} className={styles.highlightItem}>
                  <p>{highlight.text}</p>
                  {details.asin && (
                    <a
                      href={`kindle://book?action=open&asin=${details.asin}&location=${highlight.location}`}
                      className={styles.highlightLink}
                    >
                      Location. {highlight.location}
                      <span style={{ marginLeft: "6px" }}>
                        <i className="fas fa-external-link-alt"></i>
                      </span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <div className={styles.backButtonContainer}>
        <Link className={styles.backButton} href="/">
          戻る
        </Link>
      </div>

      <footer className={styles.footer}>
        <p>© 2024 読書管理. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default DetailPage;
