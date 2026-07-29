import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface SiteHeaderProps {
  title: string;
}

export default function SiteHeader({ title }: SiteHeaderProps) {
  return (
    <header className="flex w-full items-center border-b border-app-border py-4 text-2xl font-bold">
      <FontAwesomeIcon icon={faBookmark} className="mr-[1.125rem]" />
      <Link
        href="/"
        className="text-current no-underline hover:underline focus-visible:underline"
      >
        {title}
      </Link>
    </header>
  );
}
