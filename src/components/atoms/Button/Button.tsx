import { type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

const baseClasses =
  "flex h-12 w-24 cursor-pointer items-center justify-center rounded-[5px] text-xs duration-300";
const inactiveClasses = "border border-[#222] bg-black hover:border-[#0070f3]";
const activeClasses = "border border-[#0070f3] bg-black";

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
