import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { MonthlyLineChart, CategoryDonut } from '../components/Charts';
import { MonthlyReport as IMonthlyReport } from '../types';
import { Loader2, Mail, Download, Check } from 'lucide-react';
import { sendMonthlyEmail } from '../api/reports';

export const MonthlyReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const { data, isLoading } = useReports('monthly', selectedMonth);
  const [emailSent, setEmailSent] = useState(false);

  const report = data as IMonthlyReport | null;

  const handleSendEmail = async () => {
    try {
      await sendMonthlyEmail(selectedMonth);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportCSV = () => {
    if (!report) return;
    const headers = ['Date', 'Total Spent'];
    const rows = report.dailyTotals.map(d => [d.date, d.total.toFixed(2)]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `budget-report-${selectedMonth}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Report</h1>
          <p className="text-slate-500">Deep dive into your monthly spending</p>
        </div>
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <button
            onClick={handleExportCSV}
            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            title="Export CSV"
          >
            <Download size={24} />
          </button>
          <button
            onClick={handleSendEmail}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              emailSent ? 'bg-green-100 text-green-700' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-100'
            }`}
          >
            {emailSent ? <Check size={20} /> : <Mail size={20} />}
            {emailSent ? 'Sent' : 'Email Report'}
          </button>
        </div>
      </header>

      {isLoading || !report ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-teal-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900">${report.totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Daily Avg</p>
              <p className="text-2xl font-bold text-slate-900">${report.averageDaily.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Highest Day</p>
              <p className="text-2xl font-bold text-red-600">${report.highestSpendingDay.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Days Over Budget</p>
              <p className="text-2xl font-bold text-red-600">{report.overBudgetDays}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-8">Spending Trend</h3>
              <MonthlyLineChart data={report.dailyTotals} />
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-8">Category Breakdown</h3>
              <CategoryDonut data={report.categoryBreakdown} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
