import { z } from 'zod';
import { Category } from '@prisma/client';

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    category: z.nativeEnum(Category),
    reason: z.string().min(1, 'Reason is required').max(200, 'Reason too long'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  }),
});

export const updateExpenseSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    amount: z.number().positive('Amount must be positive').optional(),
    category: z.nativeEnum(Category).optional(),
    reason: z.string().min(1, 'Reason is required').max(200, 'Reason too long').optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  }),
});

export const listExpensesSchema = z.object({
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    category: z.nativeEnum(Category).optional(),
  }),
});

export const updateBudgetLimitSchema = z.object({
  body: z.object({
    limit: z.number().nonnegative('Limit must be 0 or more').nullable(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    dailyBudgetLimit: z.number().nonnegative().nullable().optional(),
  }),
});
