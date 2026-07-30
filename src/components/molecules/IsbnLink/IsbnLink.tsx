import Link from "next/link";
import { buildIsbnUrl } from "@/utils/books";

interface IsbnLinkProps {
  isbn: string;
  className?: string;
}

const NO_ISBN_LABEL = "—";

/**
 * ISBN を books.or.jp の書誌ページへリンクする。
 * ISBN が空の本ではリンク先が存在しないため、プレーンテキストにフォールバックする。
 */
export default function IsbnLink({ isbn, className }: IsbnLinkProps) {
  const href = buildIsbnUrl(isbn);

  if (!href) {
    return (
      <span className="text-app-muted">
        {/* ダッシュだけでは読み上げが空になるため、代替の文言を添える */}
        <span aria-hidden="true">{NO_ISBN_LABEL}</span>
        <span className="sr-only">登録なし</span>
      </span>
    );
  }

  const linkClasses = ["text-app-accent hover:underline", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`ISBN ${isbn} を books.or.jp で開く（新しいタブ）`}
      className={linkClasses}
    >
      {isbn}
    </Link>
  );
}
