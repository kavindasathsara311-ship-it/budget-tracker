import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, Settings, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Expenses', path: '/expenses', icon: <Receipt size={20} /> },
    { label: 'Reports', path: '/reports/weekly', icon: <BarChart3 size={20} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex bg-white border-r border-slate-100 w-64 min-h-screen p-4 flex-col sticky top-0">
        <div className="flex items-center gap-3 px-4 py-6 mb-8">
          <div className="bg-teal-600 p-2 rounded-xl text-white">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Budgetify</h1>
        </div>

        <div className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname.startsWith(item.path)
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={location.pathname.startsWith(item.path) ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mt-auto"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              location.pathname.startsWith(item.path)
                ? 'text-teal-600'
                : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Exit</span>
        </button>
      </nav>
    </>
  );
};
