import type { AppProps } from "next/app";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/globals.css";
import "../fontawesome";

export default function App({ Component, pageProps }: AppProps) {
  useScrollRestoration();
  return <Component {...pageProps} />;
}
