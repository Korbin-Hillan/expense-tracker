import { useState, useEffect } from "react";
import axios from "axios";
import { Expense, FormData } from "../types";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterByMonth = (expenses: Expense[], month: number, year: number) => {
    return expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const calculateTotalAmount = (expenses: Expense[]) => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:3000/api/expense", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      setError("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const deleteExpense = async (id: number) => {
    const token = localStorage.getItem("authToken");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const addExpense = async (formData: FormData) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post("http://localhost:3000/api/expense", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
      throw error;
    }
  };

  const updateExpense = async (id: number, formData: FormData) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(`http://localhost:3000/api/expense/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  };

  return {
    expenses,
    loading,
    error,
    filterByMonth,
    calculateTotalAmount,
    deleteExpense,
    addExpense,
    updateExpense,
    refetch: fetchExpenses,
  };
};
