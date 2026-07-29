import { Button } from "@/components";
import { ALL_YEARS_LABEL } from "@/constants/books";

interface YearFilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
}

export default function YearFilter({
  selectedYear,
  onYearChange,
  availableYears,
}: YearFilterProps) {
  return (
    <section className="mb-6 w-full" aria-label="年度フィルター">
      {/*
       * 以前は role="tablist" / role="tab" を使っていたが、対応する tabpanel も
       * 矢印キーによるロービングフォーカスもなく、支援技術に予告した操作方法が
       * 実際には効かない状態だった。実態は絞り込みトグルなので
       * group + aria-pressed で表現する。
       *
       * モバイルでは 12 年分が縦に積み上がりファーストビューを占有していたため、
       * 狭い画面では横スクロール 1 行、sm 以上では折り返して中央寄せにする。
       */}
      <div
        role="group"
        aria-label="読了年で絞り込み"
        className="flex snap-x gap-2 overflow-x-auto px-1 py-1 sm:flex-wrap sm:justify-center sm:overflow-x-visible"
      >
        {availableYears.map((year) => {
          const isSelected = year === selectedYear;
          const label =
            year === ALL_YEARS_LABEL
              ? "すべての年の本を表示"
              : `${year}年の本を表示`;

          return (
            <Button
              key={year}
              onClick={() => onYearChange(year)}
              isActive={isSelected}
              aria-pressed={isSelected}
              aria-label={label}
              className="shrink-0 snap-start"
            >
              {year === ALL_YEARS_LABEL ? ALL_YEARS_LABEL : year}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
