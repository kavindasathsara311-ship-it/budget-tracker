import { transporter } from '../config/email';
import { env } from '../config/env';

export class EmailService {
  static async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject,
        html,
      });
      console.log(`[Email] Message sent to ${to}: ${info.messageId}`);
    } catch (error: any) {
      console.error('[Email] Sending failed:', {
        to,
        subject,
        error: error.message,
        code: error.code,
        command: error.command
      });
    }
  }

  static async sendOtpEmail(to: string, code: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #0d9488;">Verify Your Account</h2>
        <p>Your one-time password (OTP) is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #0d9488; letter-spacing: 5px; text-align: center; margin: 30px 0;">
          ${code}
        </div>
        <p>This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `;
    await this.sendEmail(to, 'Your Verification Code', html);
  }
}
