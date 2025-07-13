import QuickActions from "./QuickActions";
import MonthNavigation from "./MonthNavigation";

interface SidebarProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
  selectedMonth: number;
  selectedYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function Sidebar({
  onAddExpense,
  onAddIncome,
  selectedMonth,
  selectedYear,
  onPreviousMonth,
  onNextMonth,
}: SidebarProps) {
  return (
    <div className="lg:col-span-1">
      <QuickActions onAddExpense={onAddExpense} onAddIncome={onAddIncome} />
      <MonthNavigation
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />
    </div>
  );
}
