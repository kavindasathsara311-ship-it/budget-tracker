import { useState, useEffect, useCallback } from 'react';
import { getWeeklyReport, getMonthlyReport } from '../api/reports';
import { WeeklyReport, MonthlyReport } from '../types';

export const useReports = (type: 'weekly' | 'monthly', month?: string) => {
  const [data, setData] = useState<WeeklyReport | MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = type === 'weekly' 
        ? await getWeeklyReport() 
        : await getMonthlyReport(month);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch report');
    } finally {
      setIsLoading(false);
    }
  }, [type, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refresh: fetchData };
};
