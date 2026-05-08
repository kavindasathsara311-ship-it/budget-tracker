import cron from 'node-cron';
import { prisma } from '../config/db';
import { ReportService } from '../services/reportService';
import { EmailService } from '../services/emailService';
import { weeklyReportTemplate } from '../templates/weeklyReport';

export const initWeeklyReportJob = () => {
  // Every Sunday at 8:00 PM
  cron.schedule('0 20 * * 0', async () => {
    console.log('Running weekly report job...');
    const users = await prisma.user.findMany({ where: { isVerified: true } });

    for (const user of users) {
      try {
        const report = await ReportService.getWeeklyReport(user.id);
        const html = weeklyReportTemplate(user.name, report);
        await EmailService.sendEmail(user.email, "Weekly Budget Report", html);
      } catch (error) {
        console.error(`Failed to send weekly report to ${user.email}:`, error);
      }
    }
  });
};
