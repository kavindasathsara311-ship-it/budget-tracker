import client from './client';

export const getWeeklyReport = () => client.get('/reports/weekly');

export const getMonthlyReport = (month?: string) => client.get('/reports/monthly', { params: { month } });

export const sendWeeklyEmail = () => client.post('/reports/send-weekly');

export const sendMonthlyEmail = (month?: string) => client.post('/reports/send-monthly', { month });
