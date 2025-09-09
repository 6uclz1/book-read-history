export interface Highlight {
  text: string;
  location: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  asin: string | null;
  readDate: string;
  thumnailImage: string;
  highlights: Highlight[];
}
