import { RecurringIncome, Income } from "../types";

export function getRecurringIncomesForMonth(
  recurringIncomes: RecurringIncome[],
  month: number,
  year: number
): Income[] {
  return recurringIncomes
    .filter((ri) => {
      const startDate = new Date(ri.startDate);
      return (
        ri.isActive &&
        startDate.getFullYear() <= year &&
        startDate.getMonth() <= month
      );
    })
    .map((ri) => ({
      _id: ri._id,
      amount: ri.amount,
      description: ri.description,
      date: new Date(year, month),
      createdAt: ri.createdAt ?? new Date(),
      isRecurring: true,
      source: "Recurring",
    }));
}
