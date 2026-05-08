import cron from 'node-cron';
import { prisma } from '../config/db';
import { ReportService } from '../services/reportService';
import { EmailService } from '../services/emailService';
import { monthlyReportTemplate } from '../templates/monthlyReport';

export const initMonthlyReportJob = () => {
  // 1st of each month at 8:00 AM
  cron.schedule('0 8 1 * *', async () => {
    console.log('Running monthly report job...');
    const users = await prisma.user.findMany({ where: { isVerified: true } });

    for (const user of users) {
      try {
        const report = await ReportService.getMonthlyReport(user.id);
        const html = monthlyReportTemplate(user.name, report);
        await EmailService.sendEmail(user.email, "Monthly Budget Report", html);
      } catch (error) {
        console.error(`Failed to send monthly report to ${user.email}:`, error);
      }
    }
  });
};
