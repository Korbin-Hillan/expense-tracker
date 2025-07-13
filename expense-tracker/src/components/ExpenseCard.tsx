import { Button } from "primereact/button";
import { Expense } from "../types";
import { getCategoryIcon, getCategoryColor } from "../utils/categoryUtils";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export default function ExpenseCard({
  expense,
  onEdit,
  onDelete,
}: ExpenseCardProps) {
  return (
    <div
      className={`p-5 rounded-xl border-2 ${getCategoryColor(
        expense.category
      )} hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              icon="pi pi-pencil"
              className="p-button-text text-blue-600 hover:text-blue-800 mr-2"
              onClick={() => onEdit(expense)}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-text text-red-600 hover:text-red-800"
              onClick={() => onDelete(expense._id)}
            />
            <div className="text-2xl ml-4 space-x-4">
              {getCategoryIcon(expense.category)}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {expense.description}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {expense.category} • {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">
            ${expense.amount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
