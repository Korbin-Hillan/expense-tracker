import { Button } from "primereact/button";
import { Income } from "../types";

interface IncomeCardProps {
  income: Income;
  onEdit: (income: Income) => void;
  onDelete: (id: number) => void;
}

export default function IncomeCard({
  income,
  onEdit,
  onDelete,
}: IncomeCardProps) {
  return (
    <div
      className={`p-5 rounded-xl border-2 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              icon="pi pi-pencil"
              className="p-button-text text-blue-600 hover:text-blue-800 mr-2"
              onClick={() => onEdit(income)}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-text text-red-600 hover:text-red-800"
              onClick={() => onDelete(income._id)}
            />
            <div className="text-2xl ml-4 space-x-4"></div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {income.description}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(income.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">
            ${income.amount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
