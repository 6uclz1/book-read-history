import Link from "next/link";
import Icon from "../Icon/Icon";

interface SiteHeaderProps {
  title: string;
}

export default function SiteHeader({ title }: SiteHeaderProps) {
  return (
    <header className="flex w-full items-center border-b border-app-border py-4 text-2xl font-bold">
      <Icon name="book" className="mr-[1.125rem]" />
      <Link
        href="/"
        className="text-current no-underline hover:underline focus-visible:underline"
      >
        {title}
      </Link>
    </header>
  );
}
