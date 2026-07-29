import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

// h-12 w-24 固定だと年が増えるほどモバイルの縦領域を食い潰すため、
// 幅は内容に追従させる。高さはタップターゲットの 44px を下回らないようにする。
const baseClasses =
  "flex min-h-11 cursor-pointer items-center justify-center rounded-control px-4 py-2 text-sm transition-colors duration-300";
// 背景色を固定せず、必ず前景色とセットで指定する。
// 片方だけをハードコードすると、もう一方のカラースキームで文字が消える。
const inactiveClasses =
  "border border-app-border-strong bg-app-surface text-app-fg hover:border-app-accent hover:text-app-accent";
const activeClasses =
  "border border-app-accent bg-app-accent text-app-accent-fg font-bold";

export function Button({
  isActive = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const stateClasses = isActive ? activeClasses : inactiveClasses;
  const combined = `${baseClasses} ${stateClasses} ${className}`.trim();

  // type を省略すると submit 扱いになり、フォーム内に置いた際に暴発する
  return <button type={type} className={combined} {...props} />;
}

export default Button;
