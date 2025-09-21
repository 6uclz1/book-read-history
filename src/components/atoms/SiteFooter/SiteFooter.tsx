const FOOTER_BASE_CLASS =
  "flex w-full items-center justify-center border-t border-[#222] py-8 text-gray-700 dark:text-gray-400";

interface SiteFooterProps {
  className?: string;
}

export default function SiteFooter({ className }: SiteFooterProps) {
  const footerClasses = [FOOTER_BASE_CLASS, className]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  return (
    <footer className={footerClasses}>
      <p> 📕 読書管理 </p>
    </footer>
  );
}
