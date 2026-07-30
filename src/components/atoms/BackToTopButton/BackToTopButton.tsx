import { useEffect, useState } from "react";
import Icon from "../Icon/Icon";

const SHOW_THRESHOLD_PX = 600;

/**
 * 48 冊ずつ無限スクロールで積み上がる一覧に、先頭へ戻る手段がなかったため追加する。
 * 常時表示だとカードに重なるため、一定量スクロールしてから現れる。
 */
export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SHOW_THRESHOLD_PX);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const handleClick = () => {
    // prefers-reduced-motion 時は globals.css が scroll-behavior を auto に戻す
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="ページの先頭に戻る"
      className="fixed right-4 bottom-4 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full border border-app-border-strong bg-app-surface text-app-fg shadow-lg transition-colors hover:border-app-accent hover:text-app-accent"
    >
      <Icon name="arrowUp" width="1.25em" height="1.25em" />
    </button>
  );
}
