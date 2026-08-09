import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import Icon from "../Icon/Icon";

const SearchDialog = dynamic(
  () => import("../../organisms/SearchDialog/SearchDialog"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55">
        <p
          role="status"
          className="rounded-control bg-app-surface px-5 py-3 text-sm font-bold shadow-2xl"
        >
          検索を準備しています…
        </p>
      </div>
    ),
  },
);

interface SiteHeaderProps {
  title: string;
}

export default function SiteHeader({ title }: SiteHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="flex w-full items-center border-b border-app-border py-4">
        <Icon name="book" className="mr-[1.125rem] text-2xl" />
        <Link
          href="/"
          className="text-2xl font-bold text-current no-underline hover:underline focus-visible:underline"
        >
          {title}
        </Link>
        <button
          type="button"
          className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-control border border-app-border-strong px-3 text-sm font-bold transition-colors hover:border-app-accent hover:text-app-accent sm:px-4"
          aria-label="本を検索"
          onClick={() => setIsSearchOpen(true)}
        >
          <Icon name="search" width={20} height={20} />
          <span className="hidden sm:inline">検索</span>
        </button>
      </header>
      {isSearchOpen && <SearchDialog onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
