import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { FiPlus } from "react-icons/fi";
import { Income, RecurringIncome, IncomeData } from "../types";

interface IncomeDialogProps {
  visible: boolean;
  editingIncome: Income | null;
  editingRecurringIncome?: RecurringIncome | null;
  onHide: () => void;
  onSave: (formData: IncomeData) => Promise<void>;
  onSaveRecurring?: (recurringData: any) => Promise<void>;
}

export default function IncomeDialog({
  visible,
  editingIncome,
  editingRecurringIncome,
  onHide,
  onSave,
  onSaveRecurring,
}: IncomeDialogProps) {
  const [formData, setFormData] = useState<IncomeData>({
    description: "",
    amount: 0,
    isRecurring: false,
    recurringInterval: "",
    date: new Date(),
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingIncome) {
      setFormData({
        description: editingIncome.description,
        amount: editingIncome.amount,
        isRecurring: editingIncome.isRecurring || false,
        recurringInterval: editingIncome.recurringInterval || "",
        date: new Date(editingIncome.date),
      });
    } else if (editingRecurringIncome) {
      setFormData({
        description: editingRecurringIncome.description,
        amount: editingRecurringIncome.amount,
        isRecurring: true,
        recurringInterval: editingRecurringIncome.interval,
        date: new Date(editingRecurringIncome.startDate),
      });
    } else {
      setFormData({
        description: "",
        amount: 0,
        isRecurring: false,
        recurringInterval: "",
        date: new Date(),
      });
    }
  }, [editingIncome, editingRecurringIncome, visible]);

  const handleSave = async () => {
    if (!formData.description || !formData.amount) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.isRecurring && !formData.recurringInterval) {
      alert("Please select a recurring interval");
      return;
    }

    setSaving(true);
    try {
      if (formData.isRecurring && onSaveRecurring) {
        // Handle recurring expense
        const recurringData = {
          description: formData.description,
          amount: formData.amount,
          startDate: formData.date,
          interval: formData.recurringInterval,
          isActive: true,
        };
        await onSaveRecurring(recurringData);
      } else if (editingRecurringIncome && onSaveRecurring) {
        // Handle editing existing recurring expense
        const recurringData = {
          description: formData.description,
          amount: formData.amount,
          startDate: formData.date,
          interval: formData.recurringInterval,
          isActive: true,
        };
        await onSaveRecurring(recurringData);
      } else {
        // Handle regular expense
        await onSave(formData);
      }

      // Reset form after successful save
      setFormData({
        description: "",
        amount: 0,
        isRecurring: false,
        recurringInterval: "",
        date: new Date(),
      });

      onHide(); // Close dialog after successful save
    } catch (error) {
      console.error("Error saving income:", error);
      alert("Failed to save income. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getDialogTitle = () => {
    if (editingIncome) return "Edit Income";
    if (editingRecurringIncome) return "Edit Recurring Income";
    return formData.isRecurring ? "Add Recurring Income" : "Add New Income";
  };

  const getButtonLabel = () => {
    if (editingIncome) return "Update Income";
    if (editingRecurringIncome) return "Update Recurring Income";
    return formData.isRecurring ? "Add Recurring Income" : "Add Income";
  };

  return (
    <Dialog
      header={
        <div className="flex items-center space-x-2">
          <FiPlus className="w-5 h-5" />
          <span>{getDialogTitle()}</span>
        </div>
      }
      visible={visible}
      onHide={onHide}
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
            placeholder="What is the income?"
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
              setFormData({ ...formData, amount: e.value ?? 0 })
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
            {formData.isRecurring ? "Start Date" : "Date"}
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

        {/* Only show recurring checkbox for new expenses, not when editing existing recurring */}
        {!editingRecurringIncome && (
          <div className="flex items-center space-x-2">
            <Checkbox
              inputId="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) =>
                setFormData({ ...formData, isRecurring: e.checked ?? false })
              }
            />
            <label
              htmlFor="isRecurring"
              className="text-sm font-semibold text-gray-700"
            >
              Make this a recurring expense
            </label>
          </div>
        )}

        {(formData.isRecurring || editingRecurringIncome) && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Repeat every
            </label>
            <Dropdown
              value={formData.recurringInterval}
              options={[
                { label: "Weekly", value: "Weekly" },
                { label: "Monthly", value: "Monthly" },
                { label: "Annually", value: "Annually" },
              ]}
              onChange={(e) =>
                setFormData({ ...formData, recurringInterval: e.value })
              }
              placeholder="Select interval"
              className="w-full"
              optionLabel="label"
              optionValue="value"
            />

            {formData.isRecurring && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 This will create a recurring income schedule. You can
                  manage all recurring incomes in the "Recurring Income" tab.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 gap-x-2">
          <Button
            label="Cancel"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            onClick={onHide}
            disabled={saving}
          />
          <Button
            label={getButtonLabel()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={handleSave}
            loading={saving}
          />
        </div>
      </div>
    </Dialog>
  );
}
