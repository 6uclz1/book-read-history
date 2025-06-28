import styles from "../styles/Home.module.css";

interface YearFilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
}

export default function YearFilter({ selectedYear, onYearChange, availableYears }: YearFilterProps) {
  return (
    <div className={styles.filter}>
      <div className={styles.yearButtons}>
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={
              year === selectedYear ? styles.selectedButton : styles.button
            }
          >
            {year === "All" ? "All" : year}
          </button>
        ))}
      </div>
    </div>
  );
}