import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateProfile } from '../api/auth';
import { updateBudgetLimit } from '../api/budget';
import { User, Shield, CreditCard, Save, Loader2, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, fetchProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [limit, setLimit] = useState(user?.dailyBudgetLimit?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ name });
      await updateBudgetLimit(limit === '' ? null : parseFloat(limit));
      await fetchProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your profile and budget preferences</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
              <User size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Profile Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Shield size={12} /> Email cannot be changed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
              <CreditCard size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Budget Configuration</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Daily Budget Limit ($)</label>
            <input
              type="number"
              step="0.01"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="e.g. 50.00"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
            <p className="text-xs text-slate-400 mt-2">
              We'll use this to notify you when you're exceeding your target spend.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all shadow-lg ${
            success 
              ? 'bg-green-100 text-green-700 shadow-green-100' 
              : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-100'
          }`}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : success ? (
            <>
              <Check size={20} />
              Changes Saved
            </>
          ) : (
            <>
              <Save size={20} />
              Save Settings
            </>
          )}
        </button>
      </form>
    </div>
  );
};
