import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { RecurringExpense, Expense } from "../types";
import { generateRecurringExpenses } from "../utils/recurringUtils";
import { getCategoryIcon } from "../utils/categoryUtils";

interface FutureExpensesPreviewProps {
  recurringExpenses: RecurringExpense[];
}

export default function FutureExpensesPreview({
  recurringExpenses,
}: FutureExpensesPreviewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const allGeneratedExpenses = recurringExpenses
    .filter((r) => r.isActive)
    .flatMap((r) => generateRecurringExpenses(r, 12));

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const futureExpensesForMonth = allGeneratedExpenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === selectedMonth &&
      expenseDate.getFullYear() === selectedYear
    );
  });

  const totalForMonth = futureExpensesForMonth.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Future Expenses Preview
        </h2>
        <div className="mt-3 flex items-center space-x-4">
          <Calendar
            value={selectedDate}
            onChange={(e: any) => setSelectedDate(e.value || new Date())}
            view="month"
            dateFormat="MM/yy"
            className="w-48"
          />
          <div className="text-right">
            <p className="text-sm text-gray-600">Total for month</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalForMonth.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {futureExpensesForMonth.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No recurring expenses for this month
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {futureExpensesForMonth.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {getCategoryIcon(expense.category)}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {expense.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-gray-800">
                  ${expense.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
