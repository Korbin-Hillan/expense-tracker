import { Button } from "primereact/button";
import { FiPlus } from "react-icons/fi";

interface QuickActionsProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
}

export default function QuickActions({
  onAddExpense,
  onAddIncome,
}: QuickActionsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>
      <div className="mb-4">
        <Button
          label="Add New Expense"
          icon={<FiPlus className="mr-2" />}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          onClick={onAddExpense}
        />
      </div>
      <div>
        <Button
          label="Add New Income"
          icon={<FiPlus className="mr-2" />}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          onClick={onAddIncome}
        />
      </div>
    </div>
  );
}
