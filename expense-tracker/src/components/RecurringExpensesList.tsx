import { RecurringExpense } from "../types";
import RecurringExpenseCard from "./RecurringExpenseCard";

interface RecurringExpensesListProps {
  recurringExpenses: RecurringExpense[];
  onToggle: (id: number, isActive: boolean) => void;
  onEdit: (expense: RecurringExpense) => void;
  onDelete: (id: number) => void;
}

export default function RecurringExpensesList({
  recurringExpenses,
  onToggle,
  onEdit,
  onDelete,
}: RecurringExpensesListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Recurring Expenses</h2>
        <p className="text-gray-600 mt-1">
          {recurringExpenses.filter((r) => r.isActive).length} active recurring
          payments
        </p>
      </div>

      <div className="p-6">
        {recurringExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No recurring expenses yet
            </h3>
            <p className="text-gray-500">
              Set up recurring payments like rent, subscriptions, and bills!
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {recurringExpenses.map((expense) => (
              <RecurringExpenseCard
                key={expense._id}
                recurringExpense={expense}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
