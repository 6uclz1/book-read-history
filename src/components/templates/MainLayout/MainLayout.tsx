import Head from "next/head";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/atoms";

interface MainLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  mainClassName?: string;
  containerClassName?: string;
}

const BASE_TITLE = "読書管理";
const DEFAULT_DESCRIPTION = "読んだ本をリスト化したサイトです。";
const MAIN_CONTENT_ID = "main-content";
const CONTAINER_BASE_CLASS = "flex min-h-screen flex-col";
const MAIN_BASE_CLASS = "flex flex-1 flex-col";

const combineClasses = (...classes: Array<string | undefined>) =>
  classes.filter((klass): klass is string => Boolean(klass)).join(" ");

export default function MainLayout({
  children,
  pageTitle,
  pageDescription,
  mainClassName = "items-center justify-center py-8",
  containerClassName = "px-8",
}: MainLayoutProps) {
  const computedTitle =
    pageTitle && pageTitle !== BASE_TITLE
      ? `${BASE_TITLE} | ${pageTitle}`
      : BASE_TITLE;

  const containerClasses = combineClasses(
    CONTAINER_BASE_CLASS,
    containerClassName,
  );
  const mainClasses = combineClasses(MAIN_BASE_CLASS, mainClassName);

  return (
    <div className={containerClasses}>
      <Head>
        <title>{computedTitle}</title>
        <meta
          name="description"
          content={pageDescription ?? DEFAULT_DESCRIPTION}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* キーボード利用者がヘッダーと年フィルタを読み飛ばせるようにする */}
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:border focus:border-app-accent focus:bg-app-surface focus:px-4 focus:py-2"
      >
        メインコンテンツへスキップ
      </a>

      <SiteHeader title={BASE_TITLE} />

      {/* スキップリンクの遷移先としてプログラム的にフォーカスできる必要がある */}
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className={mainClasses}>
        {children}
      </main>

      <SiteFooter className="mt-auto" />
    </div>
  );
}
