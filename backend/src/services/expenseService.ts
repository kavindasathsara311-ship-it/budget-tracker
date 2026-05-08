import { prisma } from '../config/db';
import { Category } from '@prisma/client';

export class ExpenseService {
  static async addExpense(userId: string, data: { amount: number; category: Category; reason: string; date: string }) {
    return prisma.expense.create({
      data: {
        userId,
        amount: data.amount,
        category: data.category,
        reason: data.reason,
        date: new Date(data.date),
      },
    });
  }

  static async addExpenses(userId: string, expenses: { amount: number; category: Category; reason: string; date: string }[]) {
    const results = [];
    for (const expense of expenses) {
      const created = await this.addExpense(userId, expense);
      results.push(created);
    }
    return results;
  }

  static async listExpenses(userId: string, filters: { date?: string; month?: string; category?: Category }) {
    const where: any = { userId };

    if (filters.date) {
      where.date = new Date(filters.date);
    } else if (filters.month) {
      const start = new Date(`${filters.month}-01`);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      where.date = {
        gte: start,
        lte: end,
      };
    }

    if (filters.category) {
      where.category = filters.category;
    }

    return prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  static async getTodayExpenses(userId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const limit = user?.dailyBudgetLimit ? Number(user.dailyBudgetLimit) : null;

    return {
      expenses,
      total,
      limit,
      ...this.calculateBudgetStatus(total, limit),
    };
  }

  static calculateBudgetStatus(total: number, limit: number | null) {
    if (limit === null) return { isOverBudget: false, overBy: 0, underBy: 0, percentage: 0 };
    
    const isOverBudget = total > limit;
    const overBy = isOverBudget ? total - limit : 0;
    const underBy = !isOverBudget ? limit - total : 0;
    const percentage = limit > 0 ? (total / limit) * 100 : 0;

    return { isOverBudget, overBy, underBy, percentage };
  }

  static async updateExpense(userId: string, id: string, data: any) {
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense || expense.userId !== userId) {
      throw { status: 404, message: 'Expense not found' };
    }

    return prisma.expense.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
  }

  static async deleteExpense(userId: string, id: string) {
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense || expense.userId !== userId) {
      throw { status: 404, message: 'Expense not found' };
    }

    return prisma.expense.delete({ where: { id } });
  }
}
