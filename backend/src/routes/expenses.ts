import { Router } from 'express';
import { ExpenseService } from '../services/expenseService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createExpenseSchema, updateExpenseSchema, listExpensesSchema } from '../schemas/expenseSchemas';

const router = Router();

router.use(authenticate);

router.post('/bulk', async (req: AuthRequest, res, next) => {
  try {
    const result = await ExpenseService.addExpenses(req.user!.userId, req.body.expenses);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(createExpenseSchema), async (req: AuthRequest, res, next) => {
  try {
    const expense = await ExpenseService.addExpense(req.user!.userId, req.body);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
});

router.get('/', validate(listExpensesSchema), async (req: AuthRequest, res, next) => {
  try {
    const expenses = await ExpenseService.listExpenses(req.user!.userId, req.query);
    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

router.get('/today', async (req: AuthRequest, res, next) => {
  try {
    const status = await ExpenseService.getTodayExpenses(req.user!.userId);
    res.json(status);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validate(updateExpenseSchema), async (req: AuthRequest, res, next) => {
  try {
    const expense = await ExpenseService.updateExpense(req.user!.userId, req.params.id, req.body);
    res.json(expense);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    await ExpenseService.deleteExpense(req.user!.userId, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
