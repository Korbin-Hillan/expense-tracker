interface MonthNavigationProps {
  selectedMonth: number;
  selectedYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthNavigation({
  selectedMonth,
  selectedYear,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Month Navigation
      </h3>
      <div className="flex flex-col items-center space-y-4">
        <button
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200"
          onClick={onPreviousMonth}
        >
          ← Previous Month
        </button>

        <div className="text-center p-4 bg-blue-50 rounded-xl w-full">
          <h2 className="text-xl font-bold text-blue-800">
            {new Date(selectedYear, selectedMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>

        <button
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200"
          onClick={onNextMonth}
        >
          Next Month →
        </button>
      </div>
    </div>
  );
}
