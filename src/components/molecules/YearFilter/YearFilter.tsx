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
    <div className="flex flex-1" role="region" aria-label="年度フィルター">
      <div
        className="mb-2 flex flex-wrap justify-center gap-4"
        role="tablist"
        aria-label="読了年で絞り込み"
      >
        {availableYears.map((year) => {
          const isSelected = year === selectedYear;
          const label =
            year === ALL_YEARS_LABEL ? "すべての年の本を表示" : `${year}年の本を表示`;

          return (
            <Button
              key={year}
              onClick={() => onYearChange(year)}
              isActive={isSelected}
              role="tab"
              aria-selected={isSelected}
              aria-label={label}
            >
              {year === ALL_YEARS_LABEL ? ALL_YEARS_LABEL : year}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
