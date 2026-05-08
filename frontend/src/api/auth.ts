import client from './client';

export const login = (data: any) => client.post('/auth/login', data);
export const register = (data: any) => client.post('/auth/register', data);
export const verifyOtp = (data: any) => client.post('/auth/verify-otp', data);
export const resendOtp = (data: any) => client.post('/auth/resend-otp', data);
export const logout = () => client.post('/auth/logout');
export const getProfile = () => client.get('/user/profile');
export const updateProfile = (data: any) => client.put('/user/profile', data);
