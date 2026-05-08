import client from './client';

export const updateBudgetLimit = (limit: number | null) => client.put('/budget/limit', { limit });

export const getBudgetStatus = () => client.get('/budget/status');
