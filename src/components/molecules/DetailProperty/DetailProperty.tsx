import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

interface DetailPropertyProps {
  icon: IconDefinition;
  label: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}

// ラベルと値の組なので <dl> の一項目として表現する。
// 以前は <p> + w-1/5 のラベルで、狭い画面ほど値の欄が潰れていた。
// ラベル幅を固定した 2 カラムグリッドにし、値の開始位置を揃える。
const baseContainerClass =
  "grid grid-cols-[5.5rem_1fr] items-baseline gap-x-2 py-1 text-sm leading-[1.6]";
const baseLabelClass = "text-app-muted";

export default function DetailProperty({
  icon,
  label,
  children,
  className,
  labelClassName,
}: DetailPropertyProps) {
  const containerClasses = [baseContainerClass, className]
    .filter(Boolean)
    .join(" ");
  const labelClasses = [baseLabelClass, labelClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      <dt className={labelClasses}>
        <FontAwesomeIcon icon={icon} className="mr-[0.45rem]" aria-hidden />
        {label}
      </dt>
      <dd className="m-0 break-words">{children}</dd>
    </div>
  );
}
