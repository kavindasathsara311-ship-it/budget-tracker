import { Router } from 'express';
import { AuthService } from '../services/authService';
import { OtpService } from '../services/otpService';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema } from '../schemas/authSchemas';
import { authLimiter, otpResendLimiter } from '../middleware/rateLimiter';
import { prisma } from '../config/db';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await AuthService.register(name, email, password);
    res.status(201).json({ message: 'Registration successful. Please check your email for OTP.', userId: result.userId });
  } catch (error) {
    next(error);
  }
});

router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), async (req, res, next) => {
  try {
    const { userId, code } = req.body;
    await OtpService.verifyOtp(userId, code);
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    const tokens = await AuthService.generateTokens(user.id, user.email);
    
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
});

router.post('/resend-otp', otpResendLimiter, validate(resendOtpSchema), async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && !user.isVerified) {
      const code = await OtpService.createOtp(user.id);
      const { EmailService } = await import('../services/emailService');
      await EmailService.sendOtpEmail(email, code);
    }
    // Generic response regardless of whether user exists/needs OTP
    res.json({ message: 'If an account exists and requires verification, a new OTP has been sent.' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokens = await AuthService.login(email, password);
    
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw { status: 401, message: 'Refresh token required' };

    const tokens = await AuthService.refresh(refreshToken);
    
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
