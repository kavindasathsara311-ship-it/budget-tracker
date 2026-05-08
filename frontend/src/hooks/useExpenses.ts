import { useExpenseStore } from '../store/expenseStore';
import { useEffect } from 'react';

export const useExpenses = (filters?: any) => {
  const { expenses, todayStatus, isLoading, fetchExpenses, fetchTodayStatus } = useExpenseStore();

  useEffect(() => {
    fetchExpenses(filters);
    fetchTodayStatus();
  }, [fetchExpenses, fetchTodayStatus, JSON.stringify(filters)]);

  return { expenses, todayStatus, isLoading, refresh: () => { fetchExpenses(filters); fetchTodayStatus(); } };
};
