import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { CategoryIcon } from '../components/CategoryIcon';
import { Category } from '../types';
import { Filter, Search, Calendar, Trash2, Edit2 } from 'lucide-react';
import { deleteExpense } from '../api/expenses';

export const Expenses: React.FC = () => {
  const [filters, setFilters] = useState({
    month: new Date().toISOString().split('T')[0].slice(0, 7),
    category: '' as Category | '',
  });
  
  const { expenses, isLoading, refresh } = useExpenses(filters);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        refresh();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Expense History</h1>
        <p className="text-slate-500">Manage and filter your spending records</p>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="month"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        
        <div className="flex-1 min-w-[200px] relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value as Category | '' })}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
          >
            <option value="">All Categories</option>
            {Object.values(Category).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Expense</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{expense.reason}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={expense.category} className="p-1" />
                      <span className="text-sm font-medium text-slate-600 capitalize">{expense.category.toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ${Number(expense.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                  {isLoading ? 'Loading expenses...' : 'No expenses found for this period'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
