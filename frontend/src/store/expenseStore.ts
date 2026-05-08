import { create } from 'zustand';
import { Expense, BudgetStatus } from '../types';
import { getExpenses, getTodayExpenses } from '../api/expenses';

interface ExpenseState {
  expenses: Expense[];
  todayStatus: BudgetStatus | null;
  isLoading: boolean;
  fetchExpenses: (filters?: any) => Promise<void>;
  fetchTodayStatus: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  todayStatus: null,
  isLoading: false,
  fetchExpenses: async (filters) => {
    set({ isLoading: true });
    try {
      const [expensesRes, statusRes] = await Promise.all([
        getExpenses(filters || {}),
        getTodayExpenses()
      ]);
      set({ expenses: expensesRes.data, todayStatus: statusRes.data });
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchTodayStatus: async () => {
    try {
      const { data } = await getTodayExpenses();
      set({ todayStatus: data });
    } catch (error) {
      console.error('Failed to fetch today status', error);
    }
  },
}));
