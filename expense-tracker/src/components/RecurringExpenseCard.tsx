import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { RecurringExpense } from "../types";
import { getCategoryIcon, getCategoryColor } from "../utils/categoryUtils";
import { getNextOccurrences } from "../utils/recurringUtils";

interface RecurringExpenseCardProps {
  recurringExpense: RecurringExpense;
  onToggle: (id: number, isActive: boolean) => void;
  onEdit: (expense: RecurringExpense) => void;
  onDelete: (id: number) => void;
}

export default function RecurringExpenseCard({
  recurringExpense,
  onToggle,
  onEdit,
  onDelete,
}: RecurringExpenseCardProps) {
  const nextOccurrences = getNextOccurrences(recurringExpense, 3);

  return (
    <div
      className={`p-5 rounded-xl border-2 ${getCategoryColor(
        recurringExpense.category
      )} hover:shadow-md transition-all duration-200 ${
        !recurringExpense.isActive ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getCategoryIcon(recurringExpense.category)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {recurringExpense.description}
            </h3>
            <p className="text-sm text-gray-600">
              {recurringExpense.category} • Every{" "}
              {recurringExpense.interval.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              ${recurringExpense.amount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              per {recurringExpense.interval.toLowerCase()}
            </p>
          </div>
          <InputSwitch
            checked={recurringExpense.isActive}
            onChange={(e: any) => onToggle(recurringExpense._id, e.value)}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Next payments:
            </p>
            <div className="space-y-1">
              {nextOccurrences.slice(0, 3).map((date, index) => (
                <p key={index} className="text-xs text-gray-600">
                  {date.toLocaleDateString()} - $
                  {recurringExpense.amount.toFixed(2)}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              icon="pi pi-pencil"
              className="p-button-text text-blue-600 hover:text-blue-800"
              onClick={() => onEdit(recurringExpense)}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-text text-red-600 hover:text-red-800"
              onClick={() => onDelete(recurringExpense._id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
