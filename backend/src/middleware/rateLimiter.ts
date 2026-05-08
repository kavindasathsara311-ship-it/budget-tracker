import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increased for development testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many attempts',
    message: 'Too many login/register attempts, please try again after 15 minutes',
  },
});

export const otpResendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100, // Increased for development testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate limit exceeded',
    message: 'Too many OTP resend requests, please try again after 10 minutes',
  },
});
