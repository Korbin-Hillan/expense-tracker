import { FiDollarSign } from "react-icons/fi";
import { Income } from "../types";
import IncomeCard from "./IncomeCard";

interface IncomeListProps {
  incomes: Income[];
  selectedMonth: number;
  selectedYear: number;
  onEditIncome: (income: Income) => void;
  onDeleteIncome: (id: number) => void;
}

export default function IncomeList({
  incomes,
  selectedMonth,
  selectedYear,
  onEditIncome,
  onDeleteIncome,
}: IncomeListProps) {
  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Your Incomes</h2>
          <p className="text-gray-600 mt-1">
            {incomes.length} incomes for{" "}
            {new Date(selectedYear, selectedMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="p-6">
          {incomes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No incomes yet
              </h3>
              <p className="text-gray-500">
                Start tracking your incomes by adding your first entry!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {incomes.map((income) => (
                <IncomeCard
                  key={income._id}
                  income={income}
                  onEdit={onEditIncome}
                  onDelete={onDeleteIncome}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
