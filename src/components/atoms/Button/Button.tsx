import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

const baseClasses =
  "flex h-12 w-24 cursor-pointer items-center justify-center rounded-control text-xs transition-colors duration-300";
// 背景色を固定せず、必ず前景色とセットで指定する。
// 片方だけをハードコードすると、もう一方のカラースキームで文字が消える。
const inactiveClasses =
  "border border-app-border-strong bg-app-surface text-app-fg hover:border-app-accent hover:text-app-accent";
const activeClasses =
  "border border-app-accent bg-app-accent text-app-accent-fg font-bold";

export function Button({
  isActive = false,
  className = "",
  ...props
}: ButtonProps) {
  const stateClasses = isActive ? activeClasses : inactiveClasses;
  const combined = `${baseClasses} ${stateClasses} ${className}`.trim();

  return <button className={combined} {...props} />;
}

export default Button;
