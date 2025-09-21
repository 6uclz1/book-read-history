import { type ReactNode } from "react";
import Head from "next/head";
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

      <SiteHeader title={BASE_TITLE} />

      <main className={mainClassName}>{children}</main>

      <SiteFooter />
    </div>
  );
}
