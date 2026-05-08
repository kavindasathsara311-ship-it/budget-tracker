import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { OtpService } from './otpService';
import { EmailService } from './emailService';

export class AuthService {
  static async generateTokens(userId: string, email: string) {
    const accessToken = jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Hash and store refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prisma.refreshToken.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  static async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Per security hardening: never reveal if email exists
      // However, for registration we usually tell them it's already in use
      // or we just send an email to the existing user saying they tried to register.
      // But the prompt says "Error messages must never reveal whether email exists" 
      // primarily for login. For registration, it's tricky.
      // I'll stick to a generic "Registration successful, please check your email" 
      // even if it exists, but that's confusing. 
      // Re-reading: "Error messages must never reveal whether email exists"
      // I'll return success even if user exists but handle it internally.
      return { userId: 'pending' }; 
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    const code = await OtpService.createOtp(user.id);
    await EmailService.sendOtpEmail(email, code);

    return { userId: user.id };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isVerified) {
      throw { status: 401, message: 'Invalid credentials or account not verified' };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid credentials or account not verified' };
    }

    return this.generateTokens(user.id, user.email);
  }

  static async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
      const storedTokens = await prisma.refreshToken.findMany({ where: { userId: decoded.userId } });

      let validTokenId = '';
      for (const t of storedTokens) {
        if (await bcrypt.compare(token, t.token)) {
          validTokenId = t.id;
          break;
        }
      }

      if (!validTokenId) {
        throw new Error('Invalid refresh token');
      }

      // Rotate token: delete old one
      await prisma.refreshToken.delete({ where: { id: validTokenId } });

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) throw new Error('User not found');

      return this.generateTokens(user.id, user.email);
    } catch (error) {
      throw { status: 401, message: 'Invalid refresh token' };
    }
  }

  static async logout(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
      const storedTokens = await prisma.refreshToken.findMany({ where: { userId: decoded.userId } });

      for (const t of storedTokens) {
        if (await bcrypt.compare(token, t.token)) {
          await prisma.refreshToken.delete({ where: { id: t.id } });
          break;
        }
      }
    } catch (error) {
      // Ignore errors on logout
    }
  }
}
