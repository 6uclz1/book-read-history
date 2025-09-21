import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

interface SiteHeaderProps {
  title: string;
}

export default function SiteHeader({ title }: SiteHeaderProps) {
  return (
    <header className="flex w-full items-center border-b border-[#222] py-4 text-2xl font-bold">
      <FontAwesomeIcon icon={faBookmark} className="mr-[1.125rem]" />
      {title}
    </header>
  );
}
