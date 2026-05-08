import nodemailer from 'nodemailer';
import { env } from './env';

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('SMTP server is ready to take our messages');
  } catch (error) {
    console.error('SMTP connection failed:', error);
  }
};
