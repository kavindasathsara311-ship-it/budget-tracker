import React, { useRef, useState, useEffect } from 'react';

interface Props {
  onComplete: (otp: string) => void;
  isLoading?: boolean;
}

export const OtpInput: React.FC<Props> = ({ onComplete, isLoading }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    data.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    
    if (data.length === 6) {
      onComplete(data);
    } else {
      inputs.current[data.length]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          ref={(el) => (inputs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={isLoading}
          className="w-12 h-12 text-center text-xl font-bold border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
          maxLength={1}
        />
      ))}
    </div>
  );
};
