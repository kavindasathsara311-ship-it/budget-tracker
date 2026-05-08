import { Router } from 'express';
import { prisma } from '../config/db';
import { ExpenseService } from '../services/expenseService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateBudgetLimitSchema } from '../schemas/expenseSchemas';

const router = Router();

router.use(authenticate);

router.put('/limit', validate(updateBudgetLimitSchema), async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { dailyBudgetLimit: req.body.limit },
    });
    res.json({ dailyBudgetLimit: user.dailyBudgetLimit });
  } catch (error) {
    next(error);
  }
});

router.get('/status', async (req: AuthRequest, res, next) => {
  try {
    const status = await ExpenseService.getTodayExpenses(req.user!.userId);
    res.json(status);
  } catch (error) {
    next(error);
  }
});

export default router;
