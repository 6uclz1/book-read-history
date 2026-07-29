export interface Highlight {
  text: string;
  location: string;
}

/**
 * 一覧表示に必要な項目だけを持つ本のメタデータ。
 * ハイライト本文は全体の約6割を占めるため、一覧では読み込まない。
 */
export interface BookSummary {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  asin: string | null;
  readDate: string;
  thumbnailImage: string;
}

export interface Book extends BookSummary {
  highlights: Highlight[];
}
