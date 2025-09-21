import { type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface DetailPropertyProps {
  icon: IconDefinition;
  label: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}

const baseContainerClass = "my-1 flex items-center leading-[1.5]";
const baseLabelClass = "inline-block w-1/5 text-gray-700 dark:text-gray-400";

export default function DetailProperty({
  icon,
  label,
  children,
  className = baseContainerClass,
  labelClassName,
}: DetailPropertyProps) {
  const labelClasses = `${baseLabelClass} ${labelClassName ?? ""}`.trim();

  return (
    <p className={className}>
      <span className={labelClasses}>
        <FontAwesomeIcon icon={icon} className="mr-[0.45rem]" />
        {label}
      </span>
      {children}
    </p>
  );
}
