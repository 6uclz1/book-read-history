import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      sessionStorage.setItem(`scrollPos:${router.asPath}`, window.scrollY.toString());
    };

    const handleRouteChangeComplete = (url: string) => {
      const scrollPos = sessionStorage.getItem(`scrollPos:${url}`);
      if (scrollPos) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(scrollPos, 10));
          sessionStorage.removeItem(`scrollPos:${url}`);
        }, 100); // 遅延を追加して、コンテンツの描画を待つ
      }
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