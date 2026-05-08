import { Router } from 'express';
import { ReportService } from '../services/reportService';
import { EmailService } from '../services/emailService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { weeklyReportTemplate } from '../templates/weeklyReport';
import { monthlyReportTemplate } from '../templates/monthlyReport';
import { prisma } from '../config/db';

const router = Router();

router.use(authenticate);

router.get('/weekly', async (req: AuthRequest, res, next) => {
  try {
    const report = await ReportService.getWeeklyReport(req.user!.userId);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

router.get('/monthly', async (req: AuthRequest, res, next) => {
  try {
    const report = await ReportService.getMonthlyReport(req.user!.userId, req.query.month as string);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

router.post('/send-weekly', async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    const report = await ReportService.getWeeklyReport(req.user!.userId);
    const html = weeklyReportTemplate(user!.name, report);
    await EmailService.sendEmail(user!.email, "Weekly Budget Report", html);
    res.json({ message: 'Weekly report sent to your email.' });
  } catch (error) {
    next(error);
  }
});

router.post('/send-monthly', async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    const report = await ReportService.getMonthlyReport(req.user!.userId, req.body.month);
    const html = monthlyReportTemplate(user!.name, report);
    await EmailService.sendEmail(user!.email, "Monthly Budget Report", html);
    res.json({ message: 'Monthly report sent to your email.' });
  } catch (error) {
    next(error);
  }
});

export default router;
