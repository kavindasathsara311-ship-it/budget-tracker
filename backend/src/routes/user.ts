import { Router } from 'express';
import { prisma } from '../config/db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../schemas/expenseSchemas';

const router = Router();

router.use(authenticate);

router.get('/profile', async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, dailyBudgetLimit: true, isVerified: true, createdAt: true },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/profile', validate(updateProfileSchema), async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: req.body,
      select: { id: true, name: true, email: true, dailyBudgetLimit: true },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
