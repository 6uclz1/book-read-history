import type { ReactElement, SVGProps } from "react";

export type IconName =
  | "arrowUp"
  | "barcode"
  | "book"
  | "bookOpen"
  | "bookmark"
  | "calendar"
  | "externalLink"
  | "user";

// 24x24 のグリッドで線幅を揃えた自前のアイコン。
// アイコンライブラリを丸ごと読み込まずに済むよう、使うものだけをここに置く。
const paths: Record<IconName, ReactElement> = {
  arrowUp: (
    <>
      <path d="M12 20V4.5" />
      <path d="M5 11.5 12 4.5l7 7" />
    </>
  ),
  barcode: (
    <>
      <path d="M3.5 5v14" />
      <path d="M7 5v14" />
      <path d="M10.5 5v9.5" />
      <path d="M14 5v14" />
      <path d="M17 5v9.5" />
      <path d="M20.5 5v14" />
    </>
  ),
  // 背表紙（左の縦線）と小口のふくらみで、閉じた本の輪郭を 1 本の線で描く
  book: (
    <>
      <path d="M5 19.5V5a3 3 0 0 1 3-3h11v15.5H8a2 2 0 0 0 0 4h11" />
    </>
  ),
  bookOpen: (
    <>
      <path d="M12 8v13" />
      <path d="M3 18.5V5.5a1 1 0 0 1 1-1h4A4 4 0 0 1 12 8a4 4 0 0 1 4-3.5h4a1 1 0 0 1 1 1v13" />
      <path d="M3 18.5h5A4 4 0 0 1 12 21a4 4 0 0 1 4-2.5h5" />
    </>
  ),
  bookmark: (
    <>
      <path d="M6 3h12v18.25L12 17.25 6 21.25z" />
    </>
  ),
  calendar: (
    <>
      <path d="M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v11.5A1.75 1.75 0 0 1 18.25 20H5.75A1.75 1.75 0 0 1 4 18.25z" />
      <path d="M4 10h16" />
      <path d="M8.5 3v4" />
      <path d="M15.5 3v4" />
    </>
  ),
  externalLink: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4l-8.5 8.5" />
      <path d="M18 14v4.25A1.75 1.75 0 0 1 16.25 20H5.75A1.75 1.75 0 0 1 4 18.25V7.75A1.75 1.75 0 0 1 5.75 6H10" />
    </>
  ),
  user: (
    <>
      <path d="M12 11.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5z" />
      <path d="M4.5 21v-1a5.5 5.5 0 0 1 5.5-5.5h4a5.5 5.5 0 0 1 5.5 5.5v1" />
    </>
  ),
};

interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, "children" | "aria-hidden"> {
  name: IconName;
}

/**
 * 意味は必ず隣接するテキストが持たせる前提の装飾アイコンなので、
 * 常に aria-hidden で読み上げ対象から外す。
 * 大きさは width/height 属性で受け取る（既定は文字サイズと同じ 1em）。
 * Tailwind の size-* で上書きすると同種ユーティリティの優先順位が
 * 読み手に見えなくなるため、クラスでは寸法を指定しない。
 */
export default function Icon({
  name,
  className,
  width = "1em",
  height = "1em",
  ...rest
}: IconProps) {
  const classes = ["inline-block align-[-0.125em]", className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classes}
      focusable="false"
      {...rest}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
