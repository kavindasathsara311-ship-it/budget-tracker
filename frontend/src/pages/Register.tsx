import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister, verifyOtp, resendOtp } from '../api/auth';
import { OtpInput } from '../components/OtpInput';
import { useAuthStore } from '../store/authStore';
import { Wallet, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, '1 uppercase required')
    .regex(/[0-9]/, '1 number required')
    .regex(/[^A-Za-z0-9]/, '1 special char required'),
});

type FormData = z.infer<typeof schema>;

export const Register: React.FC = () => {
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onInfoSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRegister(data);
      setUserId(response.data.userId);
      setEmail(data.email);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpComplete = async (code: string) => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await verifyOtp({ userId, code });
      localStorage.setItem('accessToken', response.data.accessToken);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendDisabled) return;
    setResendDisabled(true);
    setTimer(60);
    try {
      await resendOtp({ email });
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setResendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-teal-600 p-3 rounded-2xl text-white mb-4">
            <Wallet size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {step === 'info' ? 'Create Account' : 'Verify Email'}
          </h1>
          <p className="text-slate-500 mt-2">
            {step === 'info' ? 'Start tracking your expenses today' : `We've sent a code to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {step === 'info' ? (
          <form onSubmit={handleSubmit(onInfoSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="name@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <OtpInput onComplete={onOtpComplete} isLoading={isLoading} />
            
            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={resendDisabled || isLoading}
                className="text-teal-600 font-bold hover:underline disabled:text-slate-400 disabled:no-underline"
              >
                {resendDisabled ? `Resend in ${timer}s` : 'Resend Code'}
              </button>
            </div>
            
            <button
              onClick={() => setStep('info')}
              className="w-full text-slate-500 font-medium hover:text-slate-900 transition-colors"
            >
              Back to registration
            </button>
          </div>
        )}

        {step === 'info' && (
          <p className="text-center text-slate-500 mt-8 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
