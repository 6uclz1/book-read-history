interface YearFilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
}

const buttonBaseClasses =
  "flex text-xs h-12 w-24 cursor-pointer items-center justify-center rounded-[5px] duration-300";
const unselectedClasses =
  "border border-[#222] bg-black hover:border-[#0070f3]";
const selectedClasses = "border border-[#0070f3] bg-black";

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
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={`${buttonBaseClasses} ${
              year === selectedYear ? selectedClasses : unselectedClasses
            }`}
            role="tab"
            aria-selected={year === selectedYear}
            aria-label={
              year === "All" ? "すべての年の本を表示" : `${year}年の本を表示`
            }
          >
            {year === "All" ? "All" : year}
          </button>
        ))}
      </div>
    </div>
  );
}
