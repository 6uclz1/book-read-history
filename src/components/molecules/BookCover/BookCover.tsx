import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

interface BookCoverProps {
  src: string;
  width: number;
  height: number;
  sizes?: string;
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
  frameClassName,
  imageClassName,
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);

  const frameClasses = [baseFrameClass, frameClassName]
    .filter(Boolean)
    .join(" ");

  if (hasError) {
    return (
      <div className={[frameClasses, fallbackFrameClass].join(" ")}>
        <span className="flex flex-col items-center gap-2 text-app-muted">
          <FontAwesomeIcon icon={faBook} size="2x" aria-hidden />
          <span className="text-xs">表紙画像なし</span>
        </span>
      </div>
    );
  }

  return (
    <div className={frameClasses}>
      {/*
       * 高さを固定して object-contain で収めると、書影の比率が枠と違うぶん
       * 余白が出てしまう。枠の高さは指定せず、書影の実寸比率のまま
       * 幅いっぱいに表示する（切り抜きも余白も発生しない）。
       */}
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        sizes={sizes}
        onError={() => setHasError(true)}
        className={`h-auto w-full ${imageClassName ?? ""}`.trim()}
      />
    </div>
  );
}
