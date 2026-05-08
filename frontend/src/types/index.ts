export enum Category {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  SHOPPING = 'SHOPPING',
  HEALTH = 'HEALTH',
  ENTERTAINMENT = 'ENTERTAINMENT',
  EDUCATION = 'EDUCATION',
  HOUSING = 'HOUSING',
  UTILITIES = 'UTILITIES',
  OTHER = 'OTHER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  dailyBudgetLimit: number | null;
  isVerified: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: Category;
  reason: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetStatus {
  total: number;
  limit: number | null;
  isOverBudget: boolean;
  overBy: number;
  underBy: number;
  percentage: number;
}

export interface WeeklyReport {
  dailyBreakdown: {
    date: string;
    total: number;
    limit: number | null;
    isOverBudget: boolean;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  totalSpent: number;
  averageDaily: number;
  overBudgetDays: number;
}

export interface MonthlyReport {
  dailyTotals: {
    date: string;
    total: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  totalSpent: number;
  averageDaily: number;
  highestSpendingDay: number;
  lowestSpendingDay: number;
  overBudgetDays: number;
  withinBudgetDays: number;
}
