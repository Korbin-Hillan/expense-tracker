// components/StatsGrid.tsx - Enhanced with recurring expenses
import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import StatsCard from "./StatsCard";
import { ExpenseBreakdown } from "../utils/expenseUtils";

interface StatsGridProps {
  expenseBreakdown: ExpenseBreakdown;
  regularExpenseCount: number;
  recurringExpenseCount: number;
  selectedMonth: number;
  selectedYear: number;
}

export default function StatsGrid({
  expenseBreakdown,
  regularExpenseCount,
  recurringExpenseCount,
  selectedMonth,
  selectedYear,
}: StatsGridProps) {
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const averagePerDay = expenseBreakdown.total / daysInMonth;

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Monthly Spending"
          value={`$${expenseBreakdown.total.toFixed(2)}`}
          icon={<FiTrendingUp className="w-6 h-6" />}
          color="totalSpending"
        />
        <StatsCard
          title="Regular Expenses"
          value={`$${expenseBreakdown.regularExpenses.toFixed(2)}`}
          icon={<FiCalendar className="w-6 h-6" />}
          color="regularExpenses"
        />
        <StatsCard
          title="Recurring Payments"
          value={`$${expenseBreakdown.recurringExpenses.toFixed(2)}`}
          icon={<FiRefreshCw className="w-6 h-6" />}
          color="recurringPayments"
        />
        <StatsCard
          title="Average per Day"
          value={`$${averagePerDay.toFixed(2)}`}
          icon={<FiDollarSign className="w-6 h-6" />}
          color="averagePerDay"
        />
        <StatsCard
          title="Total Income"
          value={`$${averagePerDay.toFixed(2)}`}
          icon={<FiDollarSign className="w-6 h-6" />}
          color="totalIncome"
        />
        <StatsCard
          title="Average daily Income"
          value={`$${averagePerDay.toFixed(2)}`}
          icon={<FiDollarSign className="w-6 h-6" />}
          color="avgDailyIncome"
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Breakdown for{" "}
          {new Date(selectedYear, selectedMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Expense Types */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              Expense Categories
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    One-time Expenses
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    ${expenseBreakdown.regularExpenses.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {regularExpenseCount} transactions
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiRefreshCw className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Recurring Payments
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-purple-600">
                    ${expenseBreakdown.recurringExpenses.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {recurringExpenseCount} active subscriptions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recurring Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              Recurring Payment Types
            </h4>
            <div className="space-y-2">
              {expenseBreakdown.recurringBreakdown.weekly > 0 && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">
                    Weekly payments this month
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    ${expenseBreakdown.recurringBreakdown.weekly.toFixed(2)}
                  </span>
                </div>
              )}

              {expenseBreakdown.recurringBreakdown.monthly > 0 && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">
                    Monthly payments
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    ${expenseBreakdown.recurringBreakdown.monthly.toFixed(2)}
                  </span>
                </div>
              )}

              {expenseBreakdown.recurringBreakdown.annually > 0 && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">
                    Annual payments (prorated)
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    ${expenseBreakdown.recurringBreakdown.annually.toFixed(2)}
                  </span>
                </div>
              )}

              {expenseBreakdown.recurringExpenses === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    No recurring payments this month
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
