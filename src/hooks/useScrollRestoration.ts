import { useEffect } from "react";
import { useRouter } from "next/router";
import { BOOKS_RENDERED_EVENT, STORAGE_KEYS } from "@/constants/books";
import { buildStorageKey, readSessionStorage, writeSessionStorage } from "@/utils/storage";

const FALLBACK_DELAY_MS = 300;
const MAX_ATTEMPTS = 5;
const RESTORE_THRESHOLD = 1;

export function useScrollRestoration() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const storageKey = buildStorageKey(
      STORAGE_KEYS.scrollPositionPrefix,
      router.asPath || "/",
    );

    const handleRouteChangeStart = () => {
      writeSessionStorage(storageKey, String(window.scrollY));
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);

    const savedScroll = readSessionStorage(storageKey);
    const targetScroll =
      savedScroll !== null ? Number.parseInt(savedScroll, 10) : null;

    if (targetScroll === null || Number.isNaN(targetScroll)) {
      return () => {
        router.events.off("routeChangeStart", handleRouteChangeStart);
      };
    }

    let restored = false;
    let attempts = 0;
    let rafId: number | undefined;
    let timeoutId: number | undefined;

    const clearRestoration = () => {
      if (rafId !== undefined) {
        window.cancelAnimationFrame(rafId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener(BOOKS_RENDERED_EVENT, handleBooksRendered);
    };

    const tryRestore = () => {
      if (restored) {
        return;
      }

      window.scrollTo(0, targetScroll);
      attempts += 1;
      const distance = Math.abs(window.scrollY - targetScroll);

      if (distance <= RESTORE_THRESHOLD || attempts >= MAX_ATTEMPTS) {
        restored = true;
        clearRestoration();
      } else {
        rafId = window.requestAnimationFrame(tryRestore);
      }
    };

    const handleBooksRendered = () => {
      tryRestore();
    };

    window.addEventListener(BOOKS_RENDERED_EVENT, handleBooksRendered);

    rafId = window.requestAnimationFrame(tryRestore);
    timeoutId = window.setTimeout(tryRestore, FALLBACK_DELAY_MS);

    return () => {
      clearRestoration();
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router, router.asPath, router.events]);
}
