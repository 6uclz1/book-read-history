import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
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
  const router = useRouter();

  // フィルターが変更されたとき、または初回読み込み時に表示アイテムを設定
  useEffect(() => {
    const savedCount = sessionStorage.getItem(`itemCount:${router.asPath}`);
    const initialCount = savedCount ? parseInt(savedCount, 10) : ITEMS_PER_PAGE;
    setDisplayedBooks(filteredBooks.slice(0, initialCount));
  }, [filteredBooks, router.asPath]);

  // 表示されているアイテム数を保存
  useEffect(() => {
    const handleRouteChangeStart = () => {
      sessionStorage.setItem(`itemCount:${router.asPath}`, String(displayedBooks.length));
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.asPath, router.events, displayedBooks.length]);

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
        if (entries[0].isIntersecting && !isLoading) {
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
  }, [loadMore, isLoading]);

  const hasMore = displayedBooks.length < filteredBooks.length;

  return {
    displayedBooks,
    observerTarget,
    hasMore,
    isLoading,
  };
}
