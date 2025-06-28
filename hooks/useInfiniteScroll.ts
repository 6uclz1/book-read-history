import { useState, useEffect, useRef, useCallback } from "react";
import { Book } from "../types/book";

const ITEMS_PER_PAGE = 48;

export function useInfiniteScroll(filteredBooks: Book[]) {
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // フィルターが変更されたときに表示アイテムをリセット
  useEffect(() => {
    setDisplayedBooks(filteredBooks.slice(0, ITEMS_PER_PAGE));
  }, [filteredBooks]);

  const loadMore = useCallback(() => {
    setDisplayedBooks((prevItems) => {
      if (filteredBooks.length === prevItems.length) {
        return prevItems;
      }
      return [
        ...prevItems,
        ...filteredBooks.slice(prevItems.length, prevItems.length + ITEMS_PER_PAGE),
      ];
    });
  }, [filteredBooks]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [loadMore]);

  return {
    displayedBooks,
    observerTarget
  };
}