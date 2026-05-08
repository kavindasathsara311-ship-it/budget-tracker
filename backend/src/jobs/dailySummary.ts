import cron from 'node-cron';
import { prisma } from '../config/db';
import { ExpenseService } from '../services/expenseService';
import { EmailService } from '../services/emailService';
import { dailySummaryTemplate } from '../templates/dailySummary';

export const initDailySummaryJob = () => {
  // At 11:55 PM daily
  cron.schedule('55 23 * * *', async () => {
    console.log('Running daily summary job...');
    const users = await prisma.user.findMany({ where: { isVerified: true } });

    for (const user of users) {
      try {
        const summary = await ExpenseService.getTodayExpenses(user.id);
        const html = dailySummaryTemplate(user.name, summary);
        await EmailService.sendEmail(user.email, "Today's Budget Summary", html);
      } catch (error) {
        console.error(`Failed to send daily summary to ${user.email}:`, error);
      }
    }
  });
};
