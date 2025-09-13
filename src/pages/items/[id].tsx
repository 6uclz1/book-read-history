import { useRouter } from "next/router";
import { books } from "../../../public/books";
import { Book } from "@/types/book";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

function DetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const details: Book | undefined = books.find((book: Book) => book.id === id);

  if (!details) {
    return <div className="px-8">Book not found</div>;
  }

  return (
    <div className="px-8">
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
          href="https://use.fontawesome.com/releases/v7.0.1/css/all.css"
          rel="stylesheet"
        />
      </Head>

      <header className="flex w-full items-center border-b border-[#222] py-4 text-2xl font-bold">
        <i className="fas fa-bookmark mr-[1.125rem] font-black"></i>
        <span>読書管理</span>
      </header>

      <main className="flex min-h-[50vh] flex-1 flex-col items-center justify-start py-8">
        <div className="my-8 flex w-full max-w-[1200px] flex-col rounded-[10px] border border-[#222] p-6 md:flex-row">
          <div className="mb-8 flex-shrink-0 md:mr-8 md:mb-0 md:basis-[350px]">
            <Image
              src={details.thumnailImage}
              alt={details.title}
              width={350}
              height={500}
              className="h-auto w-full rounded-lg object-cover object-center dark:brightness-90 md:h-[500px] md:w-[350px]"
            />
          </div>
          <div className="flex w-full flex-col justify-center">
            <h2 className="mb-4 text-[2rem] font-bold leading-[1.15]">
              {details.title}
            </h2>
            <div className="my-6 border-b border-[#222]"></div>
            <p className="my-1 flex items-center text-[0.9rem] leading-[1.5]">
              <span className="inline-block w-1/5 font-bold text-gray-700 dark:text-gray-400">
                <i className="fas fa-user mr-[0.45rem] font-black"></i>著者
              </span>
              {details.author}
            </p>
            <p className="my-1 flex items-center text-[0.9rem] leading-[1.5]">
              <span className="inline-block w-1/5 font-bold text-gray-700 dark:text-gray-400">
                <i className="fas fa-bookmark mr-[0.45rem] font-black"></i>出版社
              </span>
              {details.publisher}
            </p>
            <p className="my-1 flex items-center text-[0.9rem] leading-[1.5]">
              <span className="inline-block w-1/5 font-bold text-gray-700 dark:text-gray-400">
                <i className="fas fa-barcode mr-[0.45rem] font-black"></i>ISBN
              </span>
              <Link
                href={`https://www.books.or.jp/book-details/${details.isbn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {details.isbn}
              </Link>
            </p>
            <p className="my-1 flex items-center text-[0.9rem] leading-[1.5]">
              <span className="inline-block w-1/5 font-bold text-gray-700 dark:text-gray-400">
                <i className="fas fa-calendar-alt mr-[0.45rem] font-black"></i>読了日
              </span>
              {details.readDate}
            </p>
          </div>
        </div>

        {details.highlights && details.highlights.length > 0 && (
          <div className="my-8 w-full max-w-[1200px] rounded-lg border border-[#222] p-6 text-gray-800">
            <h3 className="mb-4 flex items-center border-b border-[#222] pb-2 text-base font-bold text-gray-300">
              ハイライト
            </h3>
            <ul className="list-none p-0">
              {details.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="border-b border-[#222] py-4 leading-snug text-gray-400 last:border-b-0"
                >
                  <p>{highlight.text}</p>
                  {details.asin && (
                    <a
                      href={`kindle://book?action=open&asin=${details.asin}&location=${highlight.location}`}
                      className="mt-2 inline-block text-sm hover:underline text-right"
                      style={{ display: "block", textAlign: "right" }}
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

      <div className="flex justify-center py-8">
        <Link
          className="rounded-md border border-[#222] px-12 py-2 hover:border-[#0070f3]"
          href="/"
        >
          戻る
        </Link>
      </div>

      <footer className="flex w-full flex-1 items-center justify-center border-t border-[#222] py-4">
        <p>© 2024 読書管理. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default DetailPage;
