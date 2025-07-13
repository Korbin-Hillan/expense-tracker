export interface Expense {
  _id: number;
  description: string;
  amount: number;
  category: string;
  date: Date;
  createdAt: Date;
  isRecurring?: boolean;
  recurringInterval?: "Weekly" | "Monthly" | "Annually";
  parentRecurringId?: number;
  isGenerated?: boolean;
}

export interface RecurringExpense {
  _id: number;
  description: string;
  amount: number;
  category: string;
  startDate: Date;
  interval: "Weekly" | "Monthly" | "Annually";
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Income {
  _id: number;
  description: string;
  amount: number;
  date: Date;
  createdAt: Date;
  isRecurring?: boolean;
  recurringInterval?: "Weekly" | "Monthly" | "Annually";
  parentRecurringId?: number;
  isGenerated?: boolean;
}

export interface RecurringIncome {
  _id: number;
  description: string;
  amount: number;
  startDate: Date;
  interval: "Weekly" | "Monthly" | "Annually";
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IncomeData {
  description: string;
  amount: string | number;
  isRecurring: boolean;
  recurringInterval: string;
  date: Date;
}

export interface FormData {
  description: string;
  amount: string | number;
  category: string;
  isRecurring: boolean;
  recurringInterval: string;
  date: Date;
}

export interface CategoryOption {
  label: string;
  value: string;
}
