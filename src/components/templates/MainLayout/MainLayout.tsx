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
const CONTAINER_BASE_CLASS = "flex min-h-screen flex-col";
const MAIN_BASE_CLASS = "flex flex-1 flex-col";

const combineClasses = (
  ...classes: Array<string | undefined>
) => classes.filter((klass): klass is string => Boolean(klass)).join(" ");

export default function MainLayout({
  children,
  pageTitle,
  pageDescription,
  mainClassName = "items-center justify-center py-8",
  containerClassName = "px-8",
}: MainLayoutProps) {
  const computedTitle = pageTitle && pageTitle !== BASE_TITLE
    ? `${BASE_TITLE} | ${pageTitle}`
    : BASE_TITLE;

  const containerClasses = combineClasses(CONTAINER_BASE_CLASS, containerClassName);
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

      <SiteHeader title={BASE_TITLE} />

      <main className={mainClasses}>{children}</main>

      <SiteFooter className="mt-auto" />
    </div>
  );
}
