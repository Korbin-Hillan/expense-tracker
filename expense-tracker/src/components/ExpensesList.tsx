import { FiDollarSign } from "react-icons/fi";
import { Expense } from "../types";
import ExpenseCard from "./ExpenseCard";

interface ExpensesListProps {
  expenses: Expense[];
  selectedMonth: number;
  selectedYear: number;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
}

export default function ExpensesList({
  expenses,
  selectedMonth,
  selectedYear,
  onEditExpense,
  onDeleteExpense,
}: ExpensesListProps) {
  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Your Expenses</h2>
          <p className="text-gray-600 mt-1">
            {expenses.length} expenses for{" "}
            {new Date(selectedYear, selectedMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="p-6">
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No expenses yet
              </h3>
              <p className="text-gray-500">
                Start tracking your expenses by adding your first entry!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onEdit={onEditExpense}
                  onDelete={onDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
