import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { BudgetStatus } from '../components/BudgetStatus';
import { CategoryDonut } from '../components/Charts';
import { CategoryIcon } from '../components/CategoryIcon';
import { ExpenseForm } from '../components/ExpenseForm';
import { BulkExpenseForm } from '../components/BulkExpenseForm';
import { addExpense, addBulkExpenses } from '../api/expenses';
import { Plus, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { expenses, todayStatus, refresh } = useExpenses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExpense = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addExpense(data);
      refresh();
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const expensesWithDate = data.expenses.map((e: any) => ({
        ...e,
        date: data.date,
      }));
      await addBulkExpenses(expensesWithDate);
      refresh();
      setIsFormOpen(false);
    } catch (error: any) {
      console.error(error);
      alert('Failed to save expenses: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayExpenses = [...expenses].filter(e => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    return e.date.startsWith(today);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalFromList = todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  let runningBalance = todayStatus?.limit || 0;
  const todayExpensesWithBalance = todayExpenses.map(expense => {
    runningBalance -= Number(expense.amount);
    return { ...expense, remaining: runningBalance };
  }).reverse();

  const categoryData = Object.values(
    todayExpenses.reduce((acc: any, curr) => {
      if (!acc[curr.category]) acc[curr.category] = { category: curr.category, amount: 0 };
      acc[curr.category].amount += Number(curr.amount);
      return acc;
    }, {})
  );

  const displayStatus = todayStatus ? { ...todayStatus, total: totalFromList } : null;

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Track your daily spending and budget</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto bg-teal-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {displayStatus && <BudgetStatus status={displayStatus} />}
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900">Today's Expenses</h3>
              <Link to="/expenses" className="text-teal-600 text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {todayExpensesWithBalance.length > 0 ? (
                todayExpensesWithBalance.map((expense) => (
                  <div key={expense.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <CategoryIcon category={expense.category} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{expense.reason}</p>
                      </div>
                      <p className="text-xs text-slate-500 uppercase font-medium">{expense.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${Number(expense.amount).toFixed(2)}</p>
                      {todayStatus?.limit && (
                        <p className={`text-[10px] font-bold ${expense.remaining < 0 ? 'text-red-500' : 'text-teal-600'}`}>
                          Bal: ${expense.remaining.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 italic">No expenses recorded today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6">Spending by Category</h3>
            {categoryData.length > 0 ? (
              <CategoryDonut data={categoryData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 italic">
                Add expenses to see breakdown
              </div>
            )}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Add Daily Expenses</h2>
            <BulkExpenseForm onSubmit={handleBulkSubmit} isLoading={isSubmitting} />
          </div>
        </div>
      )}
    </div>
  );
};
