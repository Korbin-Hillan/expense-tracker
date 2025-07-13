import { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { useExpenses } from "./hooks/useExpenses";
import { useIncome } from "./hooks/useIncome";
import { useRecurringExpenses } from "./hooks/useRecurringExpenses";
import { useRecurringIncomes } from "./hooks/useRecurringIncomes";
import { useMonthNavigation } from "./hooks/useMonthNavigation";
import { Expense, RecurringExpense, Income, RecurringIncome } from "./types";
import { getExpenseBreakdown } from "./utils/expenseUtils";

// Component imports
import Header from "./components/Header";
import StatsGrid from "./components/StatsGrid";
import Sidebar from "./components/Sidebar";
import ExpensesList from "./components/ExpensesList";
import IncomeList from "./components/IncomeList";
import ExpenseDialog from "./components/ExpenseDialog";
import IncomeDialog from "./components/IncomeDialog";
import RecurringExpensesList from "./components/RecurringExpensesList";
import FutureExpensesPreview from "./components/FutureExpensesPreview";
import { getRecurringIncomesForMonth } from "./utils/incomeUtils";

export default function Dashboard() {
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingRecurringExpense, setEditingRecurringExpense] =
    useState<RecurringExpense | null>(null);
  const [showAddIncomeDialog, setShowAddIncomeDialog] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingRecurringIncome, setEditingRecurringIncome] =
    useState<RecurringIncome | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const {
    expenses,
    loading: expensesLoading,
    error: expensesError,
    filterByMonth,
    deleteExpense,
    addExpense,
    updateExpense,
  } = useExpenses();

  const {
    income,
    loading: incomeLoading,
    error: incomeError,
    filterByMonthIncome,
    deleteIncome,
    addIncome,
    updateIncome,
  } = useIncome();

  const {
    recurringIncomes,
    loading: recurringIncomeLoading,
    error: recurringIncomeError,
    addRecurringIncome,
    updateRecurringIncome,
    toggleRecurringIncome,
    deleteRecurringIncome,
  } = useRecurringIncomes();

  const {
    recurringExpenses,
    loading: recurringLoading,
    error: recurringError,
    addRecurringExpense,
    updateRecurringExpense,
    toggleRecurringExpense,
    deleteRecurringExpense,
  } = useRecurringExpenses();

  const { selectedMonth, selectedYear, goToPreviousMonth, goToNextMonth } =
    useMonthNavigation();

  const filteredExpenses = filterByMonth(expenses, selectedMonth, selectedYear);
  const filteredIncome = filterByMonthIncome(
    income,
    selectedMonth,
    selectedYear
  );

  const recurringIncomeForMonth = getRecurringIncomesForMonth(
    recurringIncomes,
    selectedMonth,
    selectedYear
  );

  const combinedIncome = [...filteredIncome, ...recurringIncomeForMonth];

  // Enhanced total calculation including recurring expenses
  const expenseBreakdown = getExpenseBreakdown(
    filteredExpenses,
    recurringExpenses,
    selectedMonth,
    selectedYear
  );

  const handleAddIncome = () => {
    setEditingIncome(null);
    setEditingRecurringIncome(null);
    setShowAddIncomeDialog(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setEditingRecurringIncome(null);
    setShowAddIncomeDialog(true);
  };

  const handleEditRecurringIncome = (recurring: RecurringIncome) => {
    setEditingRecurringIncome(recurring);
    setEditingIncome(null);
    setShowAddIncomeDialog(true);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setEditingRecurringExpense(null);
    setShowAddExpenseDialog(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setEditingRecurringExpense(null);
    setShowAddExpenseDialog(true);
  };

  const handleEditRecurring = (recurring: RecurringExpense) => {
    setEditingRecurringExpense(recurring);
    setEditingExpense(null);
    setShowAddExpenseDialog(true);
  };

  const handleSaveIncome = async (formData: any) => {
    if (editingIncome) {
      await updateIncome(editingIncome._id, formData);
    } else {
      await addIncome(formData);
    }
    setShowAddIncomeDialog(false);
    setEditingIncome(null);
    setEditingRecurringIncome(null);
  };

  const handleSaveRecurringIncome = async (recurringData: any) => {
    if (editingRecurringIncome) {
      await updateRecurringIncome(editingRecurringIncome._id, recurringData);
    } else {
      await addRecurringIncome(recurringData);
    }
    setShowAddIncomeDialog(false);
    setEditingIncome(null);
    setEditingRecurringIncome(null);
  };

  const handleSaveExpense = async (formData: any) => {
    if (editingExpense) {
      await updateExpense(editingExpense._id, formData);
    } else {
      await addExpense(formData);
    }
    setShowAddExpenseDialog(false);
    setEditingExpense(null);
    setEditingRecurringExpense(null);
  };

  const handleSaveRecurring = async (recurringData: any) => {
    if (editingRecurringExpense) {
      await updateRecurringExpense(editingRecurringExpense._id, recurringData);
    } else {
      await addRecurringExpense(recurringData);
    }
    setShowAddExpenseDialog(false);
    setEditingExpense(null);
    setEditingRecurringExpense(null);
  };

  if (expensesLoading || recurringLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  if (expensesError || recurringError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600">{expensesError || recurringError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <StatsGrid
          expenseBreakdown={expenseBreakdown}
          regularExpenseCount={filteredExpenses.length}
          recurringExpenseCount={
            recurringExpenses.filter((r) => r.isActive).length
          }
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar
            onAddExpense={handleAddExpense}
            onAddIncome={handleAddIncome}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
          />

          <div className="lg:col-span-3">
            <TabView
              activeIndex={activeTabIndex}
              onTabChange={(e) => setActiveTabIndex(e.index)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <TabPanel
                header="Current Expenses"
                leftIcon="pi pi-list mr-2"
                headerClassName="text-lg font-semibold"
              >
                <div className="p-0">
                  <ExpensesList
                    expenses={filteredExpenses}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onEditExpense={handleEditExpense}
                    onDeleteExpense={deleteExpense}
                  />
                </div>
              </TabPanel>

              <TabPanel
                header="Current Income"
                leftIcon="pi pi-list mr-2"
                headerClassName="text-lg font-semibold"
              >
                <div className="p-0">
                  <IncomeList
                    incomes={combinedIncome}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onEditIncome={handleEditIncome}
                    onDeleteIncome={deleteIncome}
                  />
                </div>
              </TabPanel>

              <TabPanel
                header="Recurring Payments"
                leftIcon="pi pi-refresh mr-2"
                headerClassName="text-lg font-semibold"
              >
                <div className="p-0">
                  <RecurringExpensesList
                    recurringExpenses={recurringExpenses}
                    onToggle={toggleRecurringExpense}
                    onEdit={handleEditRecurring}
                    onDelete={deleteRecurringExpense}
                  />
                </div>
              </TabPanel>

              <TabPanel
                header="Future Preview"
                leftIcon="pi pi-calendar mr-2"
                headerClassName="text-lg font-semibold"
              >
                <div className="p-0">
                  <FutureExpensesPreview
                    recurringExpenses={recurringExpenses}
                  />
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>

        <ExpenseDialog
          visible={showAddExpenseDialog}
          editingExpense={editingExpense}
          editingRecurring={editingRecurringExpense}
          onHide={() => {
            setShowAddExpenseDialog(false);
            setEditingExpense(null);
            setEditingRecurringExpense(null);
          }}
          onSave={handleSaveExpense}
          onSaveRecurring={handleSaveRecurring}
        />
        <IncomeDialog
          visible={showAddIncomeDialog}
          editingIncome={editingIncome}
          editingRecurringIncome={editingRecurringIncome}
          onHide={() => {
            setShowAddIncomeDialog(false);
            setEditingIncome(null);
            setEditingRecurringIncome(null);
          }}
          onSave={handleSaveIncome}
          onSaveRecurring={handleSaveRecurringIncome}
        />
      </div>
    </div>
  );
}
