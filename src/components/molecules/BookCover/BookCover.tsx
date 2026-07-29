import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

interface BookCoverProps {
  src: string;
  width: number;
  height: number;
  sizes?: string;
  /** 画像を収める枠のクラス。高さはこちらで指定する。 */
  frameClassName?: string;
  imageClassName?: string;
}

const baseFrameClass =
  "relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-app-surface-subtle";

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
  frameClassName,
  imageClassName,
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);

  const frameClasses = [baseFrameClass, frameClassName]
    .filter(Boolean)
    .join(" ");

  if (hasError) {
    return (
      <div className={frameClasses}>
        <span className="flex flex-col items-center gap-2 text-app-muted">
          <FontAwesomeIcon icon={faBook} size="2x" aria-hidden />
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
        // 判型が異なる書影を cover で切り抜くと端が欠けるため contain で収める
        className={`h-full w-full object-contain ${imageClassName ?? ""}`.trim()}
      />
    </div>
  );
}
