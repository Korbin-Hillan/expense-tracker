import { useState } from "react";
import { Button } from "primereact/button";
import { FiPlus } from "react-icons/fi";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import axios from "axios";

export default function Dashboard() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date(),
  });

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowAddDialog(true);
  };

  const handleSaveExpense = async () => {
    if (!formData.description || !formData.amount || !formData.category) {
      alert("Please fill in all fields");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      await axios.post("http://localhost:3000/api/expense", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Expense saved successfully");

      setFormData({
        description: "",
        amount: "",
        category: "",
        date: new Date(),
      });

      setShowAddDialog(false);
    } catch (error) {
      console.log("Error saving Expense", error);
      alert("Failed to save expense. Please try again.");
    }
  };

  interface Expense {
    id: number;
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
    { label: "Food", value: "Food" },
    { label: "Transportation", value: "Transportation" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Shopping", value: "Shopping" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Bills", value: "Bills" },
    { label: "Education", value: "Education" },
    { label: "Travel", value: "Travel" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute right-0 top-0">
          <Button
            label="Add Expense"
            icon={<FiPlus />}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg"
            onClick={handleAddExpense}
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track and manage your expenses</p>
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        header={editingExpense ? "Edit Expense" : "Add New Expense"}
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
        style={{ width: "500px", overflow: "hidden" }}
        modal
        className="rounded-xl shadow-lg"
        headerClassName="bg-blue-600 text-white rounded-t-xl px-6 py-3"
      >
        <div className="bg-white p-6 space-y-4 rounded-b-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <InputText
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter expense description"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              placeholder="Enter amount"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Dropdown
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.value })}
              options={categories}
              placeholder="Select category"
              panelClassName="bg-blue-500 text-white rounded-lg shadow-lg"
              className="w-1/2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Calendar
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.value || new Date() })
              }
              className="w-1/2"
              dateFormat="mm/dd/yy"
              panelClassName="bg-blue-500 text-white rounded-lg shadow-lg"
              appendTo={document.body}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              label={editingExpense ? "Update" : "Add"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition duration-200"
              onClick={handleSaveExpense}
            />
          </div>

          {/* List of monthly expenses */}
          <div>
            <ul>
              <li></li>
            </ul>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
