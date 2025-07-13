import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color:
    | "totalSpending"
    | "regularExpenses"
    | "recurringPayments"
    | "averagePerDay"
    | "totalIncome"
    | "avgDailyIncome";
}

export default function StatsCard({
  title,
  value,
  icon,
  color,
}: StatsCardProps) {
  const colorClasses: Record<StatsCardProps["color"], string> = {
    totalSpending: "border-red-100 text-red-600 bg-red-100", // RED
    regularExpenses: "border-amber-100 text-amber-600 bg-amber-100", // AMBER
    recurringPayments: "border-cyan-100 text-cyan-600 bg-cyan-100", // CYAN
    averagePerDay: "border-sky-100 text-sky-600 bg-sky-100", // SKY
    totalIncome: "border-green-100 text-green-600 bg-green-100", // GREEN
    avgDailyIncome: "border-emerald-100 text-emerald-600 bg-emerald-100", // EMERALD
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 border ${
        colorClasses[color].split(" ")[0]
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p
            className={`text-3xl font-bold ${
              colorClasses[color].split(" ")[1]
            }`}
          >
            {value}
          </p>
        </div>
        <div
          className={`p-3 rounded-full ${colorClasses[color].split(" ")[2]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
