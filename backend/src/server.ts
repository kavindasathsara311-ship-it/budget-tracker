import app from './app';
import { env } from './config/env';
import { verifyConnection } from './config/email';
import { initDailySummaryJob } from './jobs/dailySummary';
import { initWeeklyReportJob } from './jobs/weeklyReport';
import { initMonthlyReportJob } from './jobs/monthlyReport';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    // Verify Email Connection
    await verifyConnection();

    // Initialize Cron Jobs
    initDailySummaryJob();
    initWeeklyReportJob();
    initMonthlyReportJob();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
