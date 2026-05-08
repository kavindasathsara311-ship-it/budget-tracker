import React from 'react';
import { useReports } from '../hooks/useReports';
import { WeeklyBarChart } from '../components/Charts';
import { WeeklyReport as IWeeklyReport } from '../types';
import { Loader2, Mail, Check } from 'lucide-react';
import { sendWeeklyEmail } from '../api/reports';

export const WeeklyReport: React.FC = () => {
  const { data, isLoading } = useReports('weekly');
  const [emailSent, setEmailSent] = React.useState(false);

  const report = data as IWeeklyReport | null;

  const handleSendEmail = async () => {
    try {
      await sendWeeklyEmail();
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Weekly Report</h1>
          <p className="text-slate-500">Overview of your spending this week</p>
        </div>
        <button
          onClick={handleSendEmail}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            emailSent ? 'bg-green-100 text-green-700' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
          }`}
        >
          {emailSent ? <Check size={20} /> : <Mail size={20} />}
          {emailSent ? 'Sent to Email' : 'Email Report'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Total Spent</p>
          <p className="text-3xl font-bold text-slate-900">${report.totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Daily Average</p>
          <p className="text-3xl font-bold text-slate-900">${report.averageDaily.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Over Budget</p>
          <p className="text-3xl font-bold text-red-600">{report.overBudgetDays} Days</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-8">Daily Spending vs Budget</h3>
        <WeeklyBarChart data={report.dailyBreakdown} limit={report.dailyBreakdown[0]?.limit} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total Spent</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report.dailyBreakdown.map((day) => (
              <tr key={day.date} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">{day.date}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${day.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    day.isOverBudget ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {day.isOverBudget ? 'OVER BUDGET' : 'WITHIN BUDGET'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
