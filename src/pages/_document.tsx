import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  // lang を指定しないと Next.js の既定の en が使われ、
  // スクリーンリーダーが日本語を英語として読み上げてしまう（WCAG 3.1.1）。
  return (
    <Html lang="ja">
      <Head />
      <body className="bg-app-bg text-app-fg">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
