import { useState, useEffect } from "react";
import axios from "axios";
import { RecurringIncome } from "../types";

export const useRecurringIncomes = () => {
  const [recurringIncomes, setRecurringIncomes] = useState<RecurringIncome[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecurringIncomes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/recurring-income`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecurringIncomes(res.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch recurring incomes:", error);
      setError("Failed to fetch recurring incomes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringIncomes();
  }, []);

  const addRecurringIncome = async (recurringData: any) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/recurring-income`,
        recurringData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchRecurringIncomes(); // Refresh the list
    } catch (error) {
      console.error("Error saving recurring income:", error);
      throw error;
    }
  };

  const updateRecurringIncome = async (id: number, recurringData: any) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/recurring-income/${id}`,
        recurringData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchRecurringIncomes(); // Refresh the list
    } catch (error) {
      console.error("Error updating recurring income:", error);
      throw error;
    }
  };

  const toggleRecurringIncome = async (id: number, isActive: boolean) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URI}/api/recurring-income/${id}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchRecurringIncomes(); // Refresh the list
    } catch (error) {
      console.error("Error updating recurring income:", error);
      throw error;
    }
  };

  const deleteRecurringIncome = async (id: number) => {
    const token = localStorage.getItem("authToken");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recurring income?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/recurring-income/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchRecurringIncomes(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete recurring income:", error);
      alert("Failed to delete recurring income. Please try again.");
    }
  };

  return {
    recurringIncomes,
    loading,
    error,
    addRecurringIncome,
    updateRecurringIncome,
    toggleRecurringIncome,
    deleteRecurringIncome,
    refetch: fetchRecurringIncomes,
  };
};
