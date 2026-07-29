import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Link from "next/link";
import { BookDetails, BookHighlights, MainLayout } from "@/components";
import { books } from "@/data/books";
import type { Book } from "@/types/book";

export default function DetailPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { book } = props;
  const pageDescription = `${book.title}（著者: ${book.author}）の詳細ページです。`;

  return (
    <MainLayout
      pageTitle={book.title}
      pageDescription={pageDescription}
      mainClassName="flex min-h-[50vh] flex-col items-center justify-start py-8"
    >
      <BookDetails book={book} />
      <BookHighlights
        highlights={book.highlights}
        asin={book.asin}
        bookId={book.id}
      />
      <div className="flex justify-center py-8">
        <Link
          className="rounded-control border border-app-border-strong px-12 py-2 transition-colors hover:border-app-accent hover:text-app-accent"
          href="/"
        >
          一覧へ戻る
        </Link>
      </div>
    </MainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = books.map((book) => ({
    params: { id: book.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ book: Book }> = async (ctx) => {
  const rawId = ctx.params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    return { notFound: true };
  }

  const book = books.find((item) => item.id === id);

  if (!book) {
    return { notFound: true };
  }

  return {
    props: {
      book,
    },
  };
};
