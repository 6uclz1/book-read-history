import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Book } from '../types/book';

const ITEMS_PER_PAGE = 48;

interface UseInfiniteScrollReturn {
  displayedBooks: Book[];
  observerTarget: React.RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  isLoading: boolean;
}

export function useInfiniteScroll(
  filteredBooks: Book[]
): UseInfiniteScrollReturn {
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // filteredBooksの安定化
  const stableFilteredBooks = useMemo(
    () => filteredBooks,
    [JSON.stringify(filteredBooks.map(book => book.id))]
  );

  // フィルターが変更されたときに表示アイテムをリセット
  useEffect(() => {
    // ローディング中のタイムアウトをクリア
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    setIsLoading(false);
    setDisplayedBooks(stableFilteredBooks.slice(0, ITEMS_PER_PAGE));
  }, [stableFilteredBooks]);

  const loadMore = useCallback(() => {
    if (isLoading) return; // 既にローディング中の場合は何もしない

    setIsLoading(true);

    // 既存のタイムアウトをクリア
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    loadingTimeoutRef.current = setTimeout(() => {
      setDisplayedBooks((prevItems: Book[]) => {
        const currentFilteredBooks = stableFilteredBooks; // 安定化された配列を使用

        if (currentFilteredBooks.length <= prevItems.length) {
          setIsLoading(false);
          return prevItems;
        }

        const nextLength = Math.min(
          prevItems.length + ITEMS_PER_PAGE,
          currentFilteredBooks.length
        );

        const newItems = currentFilteredBooks.slice(0, nextLength);
        setIsLoading(false);
        return newItems;
      });
      loadingTimeoutRef.current = null;
    }, 100);
  }, [stableFilteredBooks, isLoading]);

  // IntersectionObserver のセットアップ（フィルター変更とは独立）
  useEffect(() => {
    // 既存のObserverをクリーンアップ
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const target = observerTarget.current;
    if (target && observerRef.current) {
      observerRef.current.observe(target);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []); // 依存配列を空にして一度だけ実行

  // targetが変更された時のObserver再接続
  useEffect(() => {
    const target = observerTarget.current;
    if (target && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(target);
    }
  }, [observerTarget.current]);

  const hasMore = displayedBooks.length < stableFilteredBooks.length;

  return {
    displayedBooks,
    observerTarget,
    hasMore,
    isLoading,
  };
}
