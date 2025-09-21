import { type ReactNode } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

interface MainLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  mainClassName?: string;
  containerClassName?: string;
}

const BASE_TITLE = "読書管理";
const DEFAULT_DESCRIPTION = "読んだ本をリスト化したサイトです。";

export default function MainLayout({
  children,
  pageTitle,
  pageDescription,
  mainClassName = "flex min-h-screen flex-col items-center justify-center py-8",
  containerClassName = "px-8",
}: MainLayoutProps) {
  const computedTitle = pageTitle && pageTitle !== BASE_TITLE
    ? `${BASE_TITLE} | ${pageTitle}`
    : BASE_TITLE;

  return (
    <div className={containerClassName}>
      <Head>
        <title>{computedTitle}</title>
        <meta
          name="description"
          content={pageDescription ?? DEFAULT_DESCRIPTION}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex w-full items-center border-b border-[#222] py-4 text-2xl font-bold">
        <FontAwesomeIcon icon={faBookmark} className="mr-[1.125rem]" />
        {BASE_TITLE}
      </header>

      <main className={mainClassName}>{children}</main>

      <footer className="flex w-full flex-1 items-center justify-center border-t border-[#222] py-8">
        <p>© 2024 読書管理. All rights reserved.</p>
      </footer>
    </div>
  );
}
