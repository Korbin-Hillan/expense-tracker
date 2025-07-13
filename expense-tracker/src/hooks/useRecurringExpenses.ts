import { useState, useEffect } from "react";
import axios from "axios";
import { RecurringExpense } from "../types";

export const useRecurringExpenses = () => {
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecurringExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        "https://expense-tracker-gqth.onrender.com/api/recurring-expense",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecurringExpenses(res.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch recurring expenses:", error);
      setError("Failed to fetch recurring expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringExpenses();
  }, []);

  const addRecurringExpense = async (recurringData: any) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        "https://expense-tracker-gqth.onrender.com/api/recurring-expense",
        recurringData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchRecurringExpenses(); // Refresh the list
    } catch (error) {
      console.error("Error saving recurring expense:", error);
      throw error;
    }
  };

  const updateRecurringExpense = async (id: number, recurringData: any) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `https://expense-tracker-gqth.onrender.com/api/recurring-expense/${id}`,
        recurringData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchRecurringExpenses(); // Refresh the list
    } catch (error) {
      console.error("Error updating recurring expense:", error);
      throw error;
    }
  };

  const toggleRecurringExpense = async (id: number, isActive: boolean) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.patch(
        `https://expense-tracker-gqth.onrender.com/api/recurring-expense/${id}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchRecurringExpenses(); // Refresh the list
    } catch (error) {
      console.error("Error updating recurring expense:", error);
      throw error;
    }
  };

  const deleteRecurringExpense = async (id: number) => {
    const token = localStorage.getItem("authToken");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recurring expense?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://expense-tracker-gqth.onrender.com/api/recurring-expense/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchRecurringExpenses(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete recurring expense:", error);
      alert("Failed to delete recurring expense. Please try again.");
    }
  };

  return {
    recurringExpenses,
    loading,
    error,
    addRecurringExpense,
    updateRecurringExpense,
    toggleRecurringExpense,
    deleteRecurringExpense,
    refetch: fetchRecurringExpenses,
  };
};
