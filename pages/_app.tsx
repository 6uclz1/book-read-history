import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // ルート変更開始時にスクロール位置を保存
    const handleRouteChangeStart = () => {
      sessionStorage.setItem(`scrollPos:${router.asPath}`, window.scrollY.toString());
    };

    // ルート変更完了後、スクロール位置を復元
    const handleRouteChangeComplete = (url: string) => {
      const scrollPos = sessionStorage.getItem(`scrollPos:${url}`);
      if (!scrollPos) return;

      let restored = false;

      const restoreScroll = () => {
        if (!restored) {
          window.scrollTo(0, parseInt(scrollPos, 10));
          restored = true;
        }
      };

      // 無限スクロールページからのカスタムイベントを待つ
      const handleBooksRendered = () => {
        restoreScroll();
        // eslint-disable-next-line no-use-before-define
        clearTimeout(fallbackTimeout);
      };

      window.addEventListener("books-rendered", handleBooksRendered, { once: true });

      // フォールバック: イベントが発生しないページのためにタイムアウトを設定
      const fallbackTimeout = setTimeout(() => {
        window.removeEventListener("books-rendered", handleBooksRendered);
        restoreScroll();
      }, 300); // 少し長めのタイムアウト
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.asPath, router.events]);

  return <Component {...pageProps} />;
}