import client from './client';
import { Category } from '../types';

export const getExpenses = (params: { date?: string; month?: string; category?: Category }) => 
  client.get('/expenses', { params });

export const getTodayExpenses = () => client.get('/expenses/today');

export const addExpense = (data: any) => client.post('/expenses', data);
export const addBulkExpenses = (expenses: any[]) => client.post('/expenses/bulk', { expenses });

export const updateExpense = (id: string, data: any) => client.put(`/expenses/${id}`, data);

export const deleteExpense = (id: string) => client.delete(`/expenses/${id}`);
