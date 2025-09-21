import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import {
  BOOKS_RENDERED_EVENT,
  ITEMS_PER_PAGE,
  STORAGE_KEYS,
} from "@/constants/books";
import { Book } from "@/types/book";
import {
  buildStorageKey,
  readSessionStorage,
  writeSessionStorage,
} from "@/utils/storage";

interface UseInfiniteScrollReturn {
  displayedBooks: Book[];
  observerTarget: React.RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  isLoading: boolean;
}

const LOAD_DELAY_MS = 100;
const OBSERVER_THRESHOLD = 1.0;

export function useInfiniteScroll(
  filteredBooks: Book[],
): UseInfiniteScrollReturn {
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const loadTimeoutRef = useRef<number | undefined>(undefined);
  const router = useRouter();

  const itemCountStorageKey = buildStorageKey(
    STORAGE_KEYS.itemCountPrefix,
    router.asPath || "/",
  );

  const loadMore = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    setIsLoading(true);

    loadTimeoutRef.current = window.setTimeout(() => {
      setDisplayedBooks((prevItems) => {
        if (prevItems.length >= filteredBooks.length) {
          return prevItems;
        }

        const nextSlice = filteredBooks.slice(
          prevItems.length,
          prevItems.length + ITEMS_PER_PAGE,
        );

        return [...prevItems, ...nextSlice];
      });
      setIsLoading(false);
    }, LOAD_DELAY_MS);
  }, [filteredBooks]);

  useLayoutEffect(() => {
    const savedCountRaw = readSessionStorage(itemCountStorageKey);
    const savedCount =
      savedCountRaw !== null ? Number.parseInt(savedCountRaw, 10) : Number.NaN;
    const initialCount =
      Number.isFinite(savedCount) && savedCount > 0
        ? savedCount
        : ITEMS_PER_PAGE;

    setDisplayedBooks(filteredBooks.slice(0, initialCount));
  }, [filteredBooks, itemCountStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: OBSERVER_THRESHOLD },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, [isLoading, loadMore]);

  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current !== undefined) {
        window.clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    writeSessionStorage(itemCountStorageKey, String(displayedBooks.length));
  }, [displayedBooks.length, itemCountStorageKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(BOOKS_RENDERED_EVENT));
    }
  }, [displayedBooks.length]);

  const hasMore = displayedBooks.length < filteredBooks.length;

  return {
    displayedBooks,
    observerTarget,
    hasMore,
    isLoading,
  };
}
