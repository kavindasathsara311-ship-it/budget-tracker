import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import expenseRoutes from './routes/expenses';
import budgetRoutes from './routes/budget';
import reportRoutes from './routes/reports';
import userRoutes from './routes/user';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(globalLimiter);

// Parsing Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

// Error Handling
app.use(errorHandler);

export default app;
