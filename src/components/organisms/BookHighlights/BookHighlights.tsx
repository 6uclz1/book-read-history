import { Icon } from "@/components";
import type { Highlight } from "@/types/book";

interface BookHighlightsProps {
  highlights: Highlight[];
  asin?: string | null;
  bookId: string;
}

export default function BookHighlights({
  highlights,
  asin,
  bookId,
}: BookHighlightsProps) {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <div className="my-8 w-full max-w-[1200px] rounded-card border border-app-border bg-app-surface p-6">
      <h3 className="mb-4 flex items-center border-b border-app-border pb-2 text-base font-bold text-app-fg">
        ハイライト
      </h3>
      <ul className="list-none p-0">
        {highlights.map((highlight, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: ハイライトはビルド時に確定し並び替えも追加も行われないため添字をキーにしても安全
            key={`${bookId}-highlight-${index}`}
            className="border-b border-app-border py-4 leading-relaxed text-app-fg last:border-b-0"
          >
            <p>{highlight.text}</p>
            {asin && (
              <a
                href={`kindle://book?action=open&asin=${asin}&location=${highlight.location}`}
                // Kindle アプリが起動することはリンク文字列からは伝わらない
                aria-label={`Kindleアプリで位置No.${highlight.location}を開く`}
                className="mt-2 block text-right text-sm text-app-muted hover:underline"
              >
                Location. {highlight.location}
                <span className="ml-[6px]">
                  <Icon name="externalLink" />
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
