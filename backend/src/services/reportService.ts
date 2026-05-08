import { prisma } from '../config/db';
import { Category } from '@prisma/client';

export class ReportService {
  static async getWeeklyReport(userId: string) {
    const today = new Date();
    const day = today.getDay() || 7; // Sunday is 7
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - day + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: startOfWeek, lte: endOfWeek },
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const limit = user?.dailyBudgetLimit ? Number(user.dailyBudgetLimit) : null;

    const dailyBreakdown = [];
    let totalSpent = 0;
    let overBudgetDays = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayTotal = expenses
        .filter(e => e.date.toDateString() === date.toDateString())
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      totalSpent += dayTotal;
      if (limit && dayTotal > limit) overBudgetDays++;

      dailyBreakdown.push({
        date: date.toISOString().split('T')[0],
        total: dayTotal,
        limit,
        isOverBudget: limit ? dayTotal > limit : false,
      });
    }

    const categoryBreakdown = this.calculateCategoryBreakdown(expenses);

    return {
      dailyBreakdown,
      categoryBreakdown,
      totalSpent,
      averageDaily: totalSpent / 7,
      overBudgetDays,
    };
  }

  static async getMonthlyReport(userId: string, monthStr?: string) {
    const date = monthStr ? new Date(`${monthStr}-01`) : new Date();
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const limit = user?.dailyBudgetLimit ? Number(user.dailyBudgetLimit) : null;

    const daysInMonth = endOfMonth.getDate();
    const dailyTotals = [];
    let totalSpent = 0;
    let highestSpend = 0;
    let lowestSpend = Infinity;
    let overBudgetDays = 0;

    for (let i = 1; i <= daysInMonth; i++) {
      const currDate = new Date(date.getFullYear(), date.getMonth(), i);
      const dayTotal = expenses
        .filter(e => e.date.toDateString() === currDate.toDateString())
        .reduce((sum, e) => sum + Number(e.amount), 0);

      totalSpent += dayTotal;
      if (dayTotal > highestSpend) highestSpend = dayTotal;
      if (dayTotal < lowestSpend) lowestSpend = dayTotal;
      if (limit && dayTotal > limit) overBudgetDays++;

      dailyTotals.push({
        date: currDate.toISOString().split('T')[0],
        total: dayTotal,
      });
    }

    if (lowestSpend === Infinity) lowestSpend = 0;

    const categoryBreakdown = this.calculateCategoryBreakdown(expenses);

    return {
      dailyTotals,
      categoryBreakdown,
      totalSpent,
      averageDaily: totalSpent / daysInMonth,
      highestSpendingDay: highestSpend,
      lowestSpendingDay: lowestSpend,
      overBudgetDays,
      withinBudgetDays: daysInMonth - overBudgetDays,
    };
  }

  private static calculateCategoryBreakdown(expenses: any[]) {
    const breakdown: Record<string, number> = {};
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    expenses.forEach(e => {
      breakdown[e.category] = (breakdown[e.category] || 0) + Number(e.amount);
    });

    return Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));
  }
}
