import { useState, useEffect } from "react";
import axios from "axios";
import { Income, IncomeData } from "../types";

export const useIncome = () => {
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterByMonthIncome = (
    incomes: Income[],
    month: number,
    year: number
  ) => {
    return incomes.filter((incomes) => {
      const date = new Date(incomes.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const calculateTotalAmount = (incomes: Income[]) => {
    return incomes.reduce((sum, incomes) => sum + incomes.amount, 0);
  };

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/income`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIncome(res.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch income:", error);
      setError("Failed to fetch income");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const deleteIncome = async (id: number) => {
    const token = localStorage.getItem("authToken");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this income?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/income/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchIncome();
    } catch (error) {
      console.error("Failed to delete income:", error);
      alert("Failed to delete income. Please try again.");
    }
  };

  const addIncome = async (formData: IncomeData) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/income`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchIncome();
    } catch (error) {
      console.error("Error saving income:", error);
      throw error;
    }
  };

  const updateIncome = async (id: number, formData: IncomeData) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/income/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchIncome();
    } catch (error) {
      console.error("Error updating income:", error);
      throw error;
    }
  };

  return {
    income,
    loading,
    error,
    filterByMonthIncome,
    calculateTotalAmount,
    deleteIncome,
    addIncome,
    updateIncome,
    refetch: fetchIncome,
  };
};
