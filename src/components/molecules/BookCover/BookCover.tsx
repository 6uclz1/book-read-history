import Image from "next/image";
import { useState } from "react";
import Icon from "../../atoms/Icon/Icon";

interface BookCoverProps {
  src: string;
  width: number;
  height: number;
  sizes?: string;
  /** 書影を3:4の枠内に収め、周囲のカードと高さを揃える。 */
  fitFrame?: boolean;
  /** 書影を収める枠のクラス。幅の制御はこちらで行う。 */
  frameClassName?: string;
  imageClassName?: string;
}

const baseFrameClass = "relative w-full overflow-hidden rounded-lg";
// 読み込み失敗時は寸法が取れないため、枠の比率だけは仮に決める
const fallbackFrameClass =
  "flex aspect-3/4 items-center justify-center bg-app-surface-subtle";

/**
 * 書影の表示。書名は隣接する見出しが読み上げるため alt="" の装飾画像として扱う。
 * 画像ホストは外部サービスであり、読み込みに失敗すると alt テキストが
 * レイアウトを破壊するため、プレースホルダに差し替える。
 */
export default function BookCover({
  src,
  width,
  height,
  sizes,
  fitFrame = false,
  frameClassName,
  imageClassName,
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);

  const frameClasses = [
    baseFrameClass,
    fitFrame
      ? "flex aspect-3/4 items-center justify-center bg-app-surface-subtle"
      : undefined,
    frameClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const imageClasses = [
    fitFrame
      ? "h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
      : "h-auto w-full",
    imageClassName,
  ]
    .filter(Boolean)
    .join(" ");

  // src が空文字列の本が実データに存在する。next/image は空 src を
  // 読み込み失敗として扱わない（onError も発火しない）ため、
  // ここで先に弾かないとコンソールエラーのまま何も表示されなくなる。
  if (!src || hasError) {
    return (
      <div className={[frameClasses, fallbackFrameClass].join(" ")}>
        <span className="flex flex-col items-center gap-2 text-app-muted">
          <Icon name="book" width="2em" height="2em" />
          <span className="text-xs">表紙画像なし</span>
        </span>
      </div>
    );
  }

  return (
    <div className={frameClasses}>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        sizes={sizes}
        onError={() => setHasError(true)}
        className={imageClasses}
      />
    </div>
  );
}
