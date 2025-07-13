import { RecurringExpense, Expense } from "../types";

export const getNextOccurrences = (
  recurringExpense: RecurringExpense,
  count: number = 3
): Date[] => {
  const occurrences: Date[] = [];
  const startDate = new Date(recurringExpense.startDate);
  const currentDate = new Date();

  // Find the next occurrence from today
  let nextDate = new Date(startDate);

  // Move to the next occurrence after today
  while (nextDate <= currentDate) {
    switch (recurringExpense.interval) {
      case "Weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "Monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "Annually":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
  }

  // Generate the requested number of future occurrences
  for (let i = 0; i < count; i++) {
    occurrences.push(new Date(nextDate));

    switch (recurringExpense.interval) {
      case "Weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "Monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "Annually":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
  }

  return occurrences;
};

export const generateRecurringExpenses = (
  recurringExpense: RecurringExpense,
  monthsAhead: number = 12
): Expense[] => {
  const generated: Expense[] = [];
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  const nextOccurrences = getNextOccurrences(recurringExpense, monthsAhead * 4); // Get enough occurrences

  nextOccurrences.forEach((date, index) => {
    if (date <= endDate) {
      generated.push({
        _id: -(recurringExpense._id * 1000 + index), // Negative ID for generated expenses
        description: `${recurringExpense.description} (Recurring)`,
        amount: recurringExpense.amount,
        category: recurringExpense.category,
        date: date,
        createdAt: recurringExpense.createdAt,
        isRecurring: true,
        recurringInterval: recurringExpense.interval,
        parentRecurringId: recurringExpense._id,
        isGenerated: true,
      });
    }
  });

  return generated;
};

export const filterByMonth = (
  expenses: Expense[],
  month: number,
  year: number
) => {
  return expenses.filter((expense) => {
    const date = new Date(expense.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};
