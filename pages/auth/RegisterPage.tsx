import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bot, CheckCircle2, ArrowRight, ArrowLeft, Mail, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<RegisterFormValues | null>(null);
  
  // Step 2 State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [otpError, setOtpError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const onStep1Submit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    // Simulate API check
    setTimeout(() => {
      setFormData(data);
      setStep(2);
      setTimer(60); // Reset timer
      setIsLoading(false);
    }, 1000);
  };

  // OTP Handling
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    setOtpError('');
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled or first empty
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    // Mock API call for resend would go here
  };

  const onStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;
    
    setIsLoading(true);
    setOtpError('');

    // Mock API Verification
    setTimeout(() => {
      if (code === "123456") {
        setStep(3);
      } else {
        setOtpError("Invalid code. Please try again.");
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
      setIsLoading(false);
    }, 1500);
  };

  const onStep3Submit = () => {
    if (!formData) return;
    login(
      { 
          id: '1', 
          name: formData.name, 
          email: formData.email,
          role: 'user',
          status: 'active',
          joinedAt: Date.now()
      },
      'fake-jwt-token'
    );
    navigate('/dashboard');
  };

  const steps = [
    { num: 1, title: 'Create Account', desc: 'Enter your details to get started.' },
    { num: 2, title: 'Verify Email', desc: 'Check your inbox for the code.' },
    { num: 3, title: 'Start Learning', desc: 'Access your personalized dashboard.' },
  ];

  return (
    <div className="min-h-screen flex bg-brand-offWhite">
      {/* Visual Side Left */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-bl from-brand-turquoise/20 via-slate-900 to-brand-purple/40"></div>
         <div className="relative z-10 p-12 max-w-lg w-full">
             <div className="space-y-8">
                 {steps.map((s, idx) => {
                    const isActive = step === s.num;
                    const isCompleted = step > s.num;
                    
                    return (
                        <div key={s.num} className="relative group">
                            {/* Connector Line */}
                            {idx !== steps.length - 1 && (
                                <div className={cn(
                                    "absolute left-6 top-12 w-0.5 h-16 -ml-[1px] transition-colors duration-500",
                                    isCompleted ? "bg-brand-turquoise" : "bg-slate-700"
                                )}></div>
                            )}
                            
                            <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "flex-shrink-0 h-12 w-12 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 z-10",
                                    isCompleted ? "bg-brand-turquoise border-brand-turquoise text-slate-900" :
                                    isActive ? "bg-brand-purple border-brand-purple text-white scale-110 shadow-[0_0_20px_rgba(108,99,255,0.5)]" :
                                    "border-slate-600 text-slate-500 bg-slate-800"
                                )}>
                                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : s.num}
                                </div>
                                <div className={cn("transition-all duration-300", isActive || isCompleted ? "opacity-100 translate-x-0" : "opacity-50")}>
                                    <h3 className={cn("font-bold text-lg", isActive ? "text-white" : "text-slate-300")}>{s.title}</h3>
                                    <p className="text-slate-400 text-sm">{s.desc}</p>
                                </div>
                            </div>
                        </div>
                    );
                 })}
             </div>
         </div>
      </div>

      {/* Form Side Right */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100 min-h-[600px] flex flex-col justify-center relative">
          
          {/* Back Button for Step 2 */}
          {step === 2 && (
            <button 
              onClick={() => setStep(1)}
              className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="text-center mb-8">
            {step === 1 && (
                <>
                    <div className="h-12 w-12 bg-brand-lavender rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Bot className="h-7 w-7 text-brand-purple" />
                    </div>
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
                        <p className="mt-2 text-sm text-slate-500">Start your journey with GeminiApp today.</p>
                    </div>
                </>
            )}
            
            {step === 2 && (
                <>
                    <div className="h-16 w-16 bg-brand-lavender/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="h-8 w-8 text-brand-purple" />
                    </div>
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-2xl font-bold text-slate-900">Verify Your Email</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            We've sent a 6-digit code to <br/>
                            <span className="font-semibold text-slate-900">{formData?.email}</span>
                        </p>
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50 animate-in zoom-in duration-300">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-2xl font-bold text-slate-900">Welcome Aboard!</h1>
                        <p className="mt-2 text-sm text-slate-500">Your account has been successfully verified.</p>
                    </div>
                </>
            )}
          </div>

          {/* STEP 1 FORM */}
          {step === 1 && (
              <form onSubmit={handleSubmit(onStep1Submit)} className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-300">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                
                <div className="pt-2">
                    <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                        Create Account
                    </Button>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-brand-purple hover:text-brand-darkPurple transition-colors">
                        Sign in
                    </Link>
                    </p>
                </div>
              </form>
          )}

          {/* STEP 2 FORM */}
          {step === 2 && (
              <form onSubmit={onStep2Submit} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                  <div className="space-y-4">
                      <div className="flex justify-between gap-2">
                          {otp.map((digit, index) => (
                              <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className={cn(
                                    "w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200 focus:ring-4 focus:ring-brand-purple/10",
                                    otpError 
                                        ? "border-red-300 bg-red-50 text-red-900 focus:border-red-500 animate-pulse" 
                                        : digit 
                                            ? "border-brand-purple bg-white text-slate-900" 
                                            : "border-slate-200 bg-brand-offWhite text-slate-900 focus:border-brand-purple focus:bg-white"
                                )}
                              />
                          ))}
                      </div>
                      
                      {otpError && (
                          <div className="flex items-center justify-center text-red-500 text-sm font-medium animate-in slide-in-from-top-1">
                              <AlertCircle className="h-4 w-4 mr-1.5" />
                              {otpError}
                          </div>
                      )}
                      
                      <div className="text-center">
                          {timer > 0 ? (
                              <p className="text-sm text-slate-400">
                                  Resend code in <span className="font-mono font-medium text-slate-600">00:{timer.toString().padStart(2, '0')}</span>
                              </p>
                          ) : (
                              <button 
                                  type="button"
                                  onClick={handleResend}
                                  className="text-sm font-semibold text-brand-turquoise hover:text-teal-600 transition-colors inline-flex items-center"
                              >
                                  <RefreshCw className="h-3 w-3 mr-1.5" /> Resend Code
                              </button>
                          )}
                      </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-brand-purple to-brand-darkPurple hover:shadow-brand-purple/40" 
                    size="lg" 
                    isLoading={isLoading} 
                    disabled={otp.join('').length < 6}
                  >
                      Verify Email
                  </Button>
                  
                  <p className="text-xs text-center text-slate-400">
                      DEMO MODE: Use code <span className="font-mono font-bold text-slate-600">123456</span> to verify
                  </p>
              </form>
          )}

          {/* STEP 3 VIEW */}
          {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300 text-center">
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left space-y-4">
                      <div className="flex items-center gap-3 text-slate-700">
                          <div className="w-6 h-6 rounded-full bg-brand-lavender flex items-center justify-center flex-shrink-0">
                             <CheckCircle2 className="h-4 w-4 text-brand-purple" />
                          </div>
                          <span className="text-sm font-medium">Profile successfully created</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                          <div className="w-6 h-6 rounded-full bg-brand-lavender flex items-center justify-center flex-shrink-0">
                             <CheckCircle2 className="h-4 w-4 text-brand-purple" />
                          </div>
                          <span className="text-sm font-medium">Email address verified</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                          <div className="w-6 h-6 rounded-full bg-brand-lavender flex items-center justify-center flex-shrink-0">
                             <CheckCircle2 className="h-4 w-4 text-brand-purple" />
                          </div>
                          <span className="text-sm font-medium">Workspace ready for setup</span>
                      </div>
                  </div>

                  <Button 
                    onClick={onStep3Submit} 
                    className="w-full bg-brand-turquoise hover:bg-teal-500 shadow-lg shadow-brand-turquoise/20 h-14 text-lg" 
                  >
                      Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};