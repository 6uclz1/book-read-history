import styles from "../styles/Home.module.css";

interface YearFilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
}

export default function YearFilter({ selectedYear, onYearChange, availableYears }: YearFilterProps) {
  return (
    <div className={styles.filter} role="region" aria-label="年度フィルター">
      <div className={styles.yearButtons} role="tablist" aria-label="読了年で絞り込み">
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={
              year === selectedYear ? styles.selectedButton : styles.button
            }
            role="tab"
            aria-selected={year === selectedYear}
            aria-label={year === "All" ? "すべての年の本を表示" : `${year}年の本を表示`}
          >
            {year === "All" ? "All" : year}
          </button>
        ))}
      </div>
    </div>
  );
}