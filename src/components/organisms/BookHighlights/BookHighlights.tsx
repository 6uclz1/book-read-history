import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
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
    <div className="my-8 w-full max-w-[1200px] rounded-lg border border-[#222] p-6 text-gray-800">
      <h3 className="mb-4 flex items-center border-b border-[#222] pb-2 text-base font-bold text-gray-300">
        ハイライト
      </h3>
      <ul className="list-none p-0">
        {highlights.map((highlight, index) => (
          <li
            key={`${bookId}-highlight-${index}`}
            className="border-b border-[#222] py-4 leading-snug text-gray-400 last:border-b-0"
          >
            <p>{highlight.text}</p>
            {asin && (
              <a
                href={`kindle://book?action=open&asin=${asin}&location=${highlight.location}`}
                className="mt-2 inline-block text-sm hover:underline"
                style={{ display: "block", textAlign: "right" }}
              >
                Location. {highlight.location}
                <span className="ml-[6px]">
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
