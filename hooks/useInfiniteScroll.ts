import { useState, useEffect, useRef, useCallback } from "react";
import { Book } from "../types/book";

const ITEMS_PER_PAGE = 48;

interface UseInfiniteScrollReturn {
  displayedBooks: Book[];
  observerTarget: React.RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  isLoading: boolean;
}

export function useInfiniteScroll(filteredBooks: Book[]): UseInfiniteScrollReturn {
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // フィルターが変更されたときに表示アイテムをリセット
  useEffect(() => {
    setDisplayedBooks(filteredBooks.slice(0, ITEMS_PER_PAGE));
  }, [filteredBooks]);

  const loadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedBooks((prevItems: Book[]) => {
        if (filteredBooks.length === prevItems.length) {
          setIsLoading(false);
          return prevItems;
        }
        const newItems = [
          ...prevItems,
          ...filteredBooks.slice(prevItems.length, prevItems.length + ITEMS_PER_PAGE),
        ];
        setIsLoading(false);
        return newItems;
      });
    }, 100); // スムーズな読み込み体験のための軽微な遅延
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

  const hasMore = displayedBooks.length < filteredBooks.length;

  return {
    displayedBooks,
    observerTarget,
    hasMore,
    isLoading
  };
}