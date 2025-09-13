import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../fontawesome";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // ページを離れる際にスクロール位置を保存
    const handleRouteChangeStart = () => {
      sessionStorage.setItem(
        `scrollPos:${router.asPath}`,
        window.scrollY.toString(),
      );
    };
    router.events.on("routeChangeStart", handleRouteChangeStart);

    // ページが表示されるたびにスクロール位置の復元を試みる
    const scrollPos = sessionStorage.getItem(`scrollPos:${router.asPath}`);
    if (scrollPos) {
      let restored = false;

      const restoreScroll = () => {
        if (restored) return;
        window.scrollTo(0, parseInt(scrollPos, 10));
        restored = true;
      };

      // 無限スクロールページからのカスタムイベントを待つ
      const handleBooksRendered = () => {
        restoreScroll();
        // eslint-disable-next-line no-use-before-define
        clearTimeout(fallbackTimeout);
      };

      window.addEventListener("books-rendered", handleBooksRendered, {
        once: true,
      });

      // フォールバック: イベントが発生しないページのためにタイムアウトを設定
      const fallbackTimeout = setTimeout(() => {
        window.removeEventListener("books-rendered", handleBooksRendered);
        restoreScroll();
      }, 300);
    }

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.asPath, router.events]);

  return <Component {...pageProps} />;
}
