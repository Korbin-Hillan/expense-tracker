// utils/expenseUtils.ts - Enhanced version

import { Expense, RecurringExpense } from "../types";

// Original function (keep for backward compatibility)
export const calculateTotalAmount = (expenses: Expense[]) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

// New function that includes recurring expenses for a specific month
export const calculateTotalWithRecurring = (
  expenses: Expense[],
  recurringExpenses: RecurringExpense[],
  month: number,
  year: number
) => {
  // Calculate regular expenses total
  const regularTotal = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate recurring expenses that would occur in this month
  const recurringTotal = recurringExpenses
    .filter((recurring) => recurring.isActive) // Only active recurring expenses
    .reduce((sum, recurring) => {
      const occurrencesInMonth = getOccurrencesInMonth(recurring, month, year);
      return sum + recurring.amount * occurrencesInMonth;
    }, 0);

  return regularTotal + recurringTotal;
};

// Helper function to calculate how many times a recurring expense occurs in a specific month
export const getOccurrencesInMonth = (
  recurringExpense: RecurringExpense,
  month: number,
  year: number
): number => {
  const startDate = new Date(recurringExpense.startDate);
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0); // Last day of the month

  // If the recurring expense hasn't started yet in this month, return 0
  if (startDate > monthEnd) {
    return 0;
  }

  let count = 0;
  let currentDate = new Date(
    Math.max(startDate.getTime(), monthStart.getTime())
  );

  while (currentDate <= monthEnd) {
    // Check if this date falls within the month
    if (
      currentDate.getMonth() === month &&
      currentDate.getFullYear() === year
    ) {
      count++;
    }

    // Move to next occurrence
    switch (recurringExpense.interval) {
      case "Weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "Monthly":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "Annually":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
  }

  return count;
};

// Alternative: Simple approach - just add monthly equivalents
export const calculateMonthlyTotalWithRecurring = (
  expenses: Expense[],
  recurringExpenses: RecurringExpense[]
) => {
  const regularTotal = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Convert all recurring expenses to monthly equivalents
  const monthlyRecurringTotal = recurringExpenses
    .filter((recurring) => recurring.isActive)
    .reduce((sum, recurring) => {
      let monthlyAmount = recurring.amount;

      switch (recurring.interval) {
        case "Weekly":
          monthlyAmount = recurring.amount * 4.33; // Average weeks per month
          break;
        case "Monthly":
          monthlyAmount = recurring.amount;
          break;
        case "Annually":
          monthlyAmount = recurring.amount / 12;
          break;
      }

      return sum + monthlyAmount;
    }, 0);

  return regularTotal + monthlyRecurringTotal;
};

// For displaying recurring expenses breakdown
export interface ExpenseBreakdown {
  regularExpenses: number;
  recurringExpenses: number;
  total: number;
  recurringBreakdown: {
    weekly: number;
    monthly: number;
    annually: number;
  };
}

export const getExpenseBreakdown = (
  expenses: Expense[],
  recurringExpenses: RecurringExpense[],
  month: number,
  year: number
): ExpenseBreakdown => {
  const regularExpenses = calculateTotalAmount(expenses);

  const recurringBreakdown = {
    weekly: 0,
    monthly: 0,
    annually: 0,
  };

  const recurringTotal = recurringExpenses
    .filter((recurring) => recurring.isActive)
    .reduce((sum, recurring) => {
      const occurrences = getOccurrencesInMonth(recurring, month, year);
      const monthlyAmount = recurring.amount * occurrences;

      // Track by interval type
      switch (recurring.interval) {
        case "Weekly":
          recurringBreakdown.weekly += monthlyAmount;
          break;
        case "Monthly":
          recurringBreakdown.monthly += monthlyAmount;
          break;
        case "Annually":
          recurringBreakdown.annually += monthlyAmount;
          break;
      }

      return sum + monthlyAmount;
    }, 0);

  return {
    regularExpenses,
    recurringExpenses: recurringTotal,
    total: regularExpenses + recurringTotal,
    recurringBreakdown,
  };
};
