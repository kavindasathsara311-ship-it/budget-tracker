import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../config/db';

export class OtpService {
  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async createOtp(userId: string) {
    const code = this.generateCode();
    const hashedCode = await bcrypt.hash(code, 12);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpCode.create({
      data: {
        userId,
        code: hashedCode,
        expiresAt,
      },
    });

    return code;
  }

  static async verifyOtp(userId: string, submittedCode: string) {
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw { status: 400, message: 'Invalid or expired OTP' };
    }

    if (otpRecord.failedAttempts >= 5) {
      // Check if blocked
      const blockDuration = 15 * 60 * 1000;
      const lastAttempt = otpRecord.createdAt; // Simplification, ideally track last failed attempt time
      throw { status: 429, message: 'Too many failed attempts. Please try again later.' };
    }

    const isMatch = await bcrypt.compare(submittedCode, otpRecord.code);

    if (!isMatch) {
      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { failedAttempts: { increment: 1 } },
      });
      throw { status: 400, message: 'Invalid OTP' };
    }

    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    return true;
  }
}
