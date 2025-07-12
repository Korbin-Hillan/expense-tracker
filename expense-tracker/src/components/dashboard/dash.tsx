import { Button } from "primereact/button";
import { FiPlus, FiDollarSign, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date(),
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get("http://localhost:3000/api/expense", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setExpenses(res.data))
      .catch((error) => console.error("Failed to fetch expenses:", error));
  }, []);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowAddDialog(true);
  };

  const filterByMonth = (expenses: Expense[], month: number, year: number) => {
    return expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const handleDeleteExpense = async (id: number) => {
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

      const res = await axios.get("http://localhost:3000/api/expense", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const handleSaveExpense = async () => {
    if (!formData.description || !formData.amount || !formData.category) {
      alert("Please fill in all fields");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      if (editingExpense) {
        await axios.put(
          `http://localhost:3000/api/expense/${editingExpense._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post("http://localhost:3000/api/expense", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const res = await axios.get("http://localhost:3000/api/expense", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);

      setFormData({
        description: "",
        amount: "",
        category: "",
        date: new Date(),
      });
      setEditingExpense(null);
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Please try again.");
    }
  };

  interface Expense {
    _id: number;
    description: string;
    amount: number;
    category: string;
    date: Date;
    createdAt: Date;
  }

  interface CategoryOption {
    label: string;
    value: string;
  }

  const categories: CategoryOption[] = [
    { label: "🍔 Food", value: "Food" },
    { label: "🚗 Transportation", value: "Transportation" },
    { label: "🎬 Entertainment", value: "Entertainment" },
    { label: "🛍️ Shopping", value: "Shopping" },
    { label: "🏥 Healthcare", value: "Healthcare" },
    { label: "📄 Bills", value: "Bills" },
    { label: "📚 Education", value: "Education" },
    { label: "✈️ Travel", value: "Travel" },
    { label: "📦 Other", value: "Other" },
  ];

  const getCategoryIcon = (category: string) => {
    const icons = {
      Food: "🍔",
      Transportation: "🚗",
      Entertainment: "🎬",
      Shopping: "🛍️",
      Healthcare: "🏥",
      Bills: "📄",
      Education: "📚",
      Travel: "✈️",
      Other: "📦",
    };
    return icons[category as keyof typeof icons] || "📦";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Food: "bg-orange-100 border-orange-200",
      Transportation: "bg-blue-100 border-blue-200",
      Entertainment: "bg-purple-100 border-purple-200",
      Shopping: "bg-pink-100 border-pink-200",
      Healthcare: "bg-red-100 border-red-200",
      Bills: "bg-yellow-100 border-yellow-200",
      Education: "bg-green-100 border-green-200",
      Travel: "bg-indigo-100 border-indigo-200",
      Other: "bg-gray-100 border-gray-200",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 border-gray-200"
    );
  };

  const filteredExpenses = filterByMonth(expenses, selectedMonth, selectedYear);
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <FiDollarSign className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your finances with ease
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Total
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiTrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Expenses
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredExpenses.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiCalendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average per Day
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  $
                  {(
                    totalAmount /
                    new Date(selectedYear, selectedMonth + 1, 0).getDate()
                  ).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiDollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Month Navigation and Add Button */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <Button
                label="Add New Expense"
                icon={<FiPlus className="mr-2" />}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                onClick={handleAddExpense}
              />
            </div>

            {/* Month Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Month Navigation
              </h3>
              <div className="flex flex-col items-center space-y-4">
                <button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear((prev) => prev - 1);
                    } else {
                      setSelectedMonth((prev) => prev - 1);
                    }
                  }}
                >
                  ← Previous Month
                </button>

                <div className="text-center p-4 bg-blue-50 rounded-xl w-full">
                  <h2 className="text-xl font-bold text-blue-800">
                    {new Date(selectedYear, selectedMonth).toLocaleString(
                      "default",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </h2>
                </div>

                <button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  onClick={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear((prev) => prev + 1);
                    } else {
                      setSelectedMonth((prev) => prev + 1);
                    }
                  }}
                >
                  Next Month →
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Expenses List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Expenses
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredExpenses.length} expenses for{" "}
                  {new Date(selectedYear, selectedMonth).toLocaleString(
                    "default",
                    { month: "long", year: "numeric" }
                  )}
                </p>
              </div>

              <div className="p-6">
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiDollarSign className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No expenses yet
                    </h3>
                    <p className="text-gray-500">
                      Start tracking your expenses by adding your first entry!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {filteredExpenses.map((expense) => (
                      <div
                        key={expense._id}
                        className={`p-5 rounded-xl border-2 ${getCategoryColor(
                          expense.category
                        )} hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                icon="pi pi-pencil"
                                className="p-button-text text-blue-600 hover:text-blue-800 mr-2"
                                onClick={() => {
                                  setEditingExpense(expense);
                                  setFormData({
                                    description: expense.description,
                                    amount: expense.amount,
                                    category: expense.category,
                                    date: new Date(expense.date),
                                  });
                                  setShowAddDialog(true);
                                }}
                              />
                              <Button
                                icon="pi pi-trash"
                                className="p-button-text text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteExpense(expense._id)}
                              />
                              <div className="text-2xl ml-4 space-x-4">
                                {getCategoryIcon(expense.category)}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {expense.description}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {expense.category} •{" "}
                                {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">
                              ${expense.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Dialog */}
        <Dialog
          header={
            <div className="flex items-center space-x-2">
              <FiPlus className="w-5 h-5" />
              <span>{editingExpense ? "Edit Expense" : "Add New Expense"}</span>
            </div>
          }
          visible={showAddDialog}
          onHide={() => setShowAddDialog(false)}
          style={{ width: "550px" }}
          modal
          className="rounded-2xl shadow-2xl"
          headerClassName="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-2xl px-6 py-4"
        >
          <div className="bg-white p-6 space-y-6 rounded-b-2xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <InputText
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What did you spend on?"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>
              <InputNumber
                value={formData.amount}
                onValueChange={(e) =>
                  setFormData({ ...formData, amount: e.value })
                }
                mode="currency"
                currency="USD"
                locale="en-US"
                placeholder="0.00"
                className="w-full"
                inputClassName="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <Dropdown
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.value })
                }
                options={categories}
                placeholder="Select a category"
                className="w-full"
                panelClassName="bg-white border border-gray-200 rounded-xl shadow-lg"
                itemTemplate={(option) => (
                  <div className="flex items-center space-x-2 p-2">
                    <span>{option.label}</span>
                  </div>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <Calendar
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.value || new Date() })
                }
                className="w-full"
                inputClassName="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dateFormat="mm/dd/yy"
                panelClassName="bg-white border border-gray-200 rounded-xl shadow-lg"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                label="Cancel"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                onClick={() => setShowAddDialog(false)}
              />
              <Button
                label={editingExpense ? "Update Expense" : "Add Expense"}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                onClick={handleSaveExpense}
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
