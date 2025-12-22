import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/api/useAuthApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bot, CheckCircle2, ArrowRight, Building2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { getApiError } from '../../lib/api/client';
import { cn } from '../../lib/utils';

const ORGANIZATIONS = [
  { value: 'AI Skills Lab', label: 'AI Skills Lab' },
  { value: 'AI Tools Hub', label: 'AI Tools Hub' },
  { value: 'Test My Skills', label: 'Test My Skills' },
];

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  organizationName: z.string().min(1, 'Please select an organization'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const signupMutation = useSignup();
  const [step, setStep] = React.useState(1);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organizationName: ORGANIZATIONS[0].value,
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const result = await signupMutation.mutateAsync({
        email: data.email,
        password: data.password,
        name: data.name,
        organizationName: data.organizationName,
      });

      setStep(2);

      showToast({
        title: 'Account created!',
        description: `Welcome to SkillForge, ${result.user.name || result.user.email}!`,
        variant: 'success'
      });
    } catch (error) {
      const apiError = getApiError(error);
      showToast({
        title: 'Registration failed',
        description: apiError.message,
        variant: 'error'
      });
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const steps = [
    { num: 1, title: 'Create Account', desc: 'Enter your details to get started.' },
    { num: 2, title: 'Start Learning', desc: 'Access your personalized dashboard.' },
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

          <div className="text-center mb-8">
            {step === 1 && (
                <>
                    <div className="h-12 w-12 bg-brand-lavender rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Bot className="h-7 w-7 text-brand-purple" />
                    </div>
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
                        <p className="mt-2 text-sm text-slate-500">Start your journey with SkillForge today.</p>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50 animate-in zoom-in duration-300">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-2xl font-bold text-slate-900">Welcome Aboard!</h1>
                        <p className="mt-2 text-sm text-slate-500">Your account has been successfully created.</p>
                    </div>
                </>
            )}
          </div>

          {/* STEP 1 FORM */}
          {step === 1 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Organization
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <select
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all appearance-none cursor-pointer"
                      {...register('organizationName')}
                    >
                      {ORGANIZATIONS.map((org) => (
                        <option key={org.value} value={org.value}>
                          {org.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.organizationName && (
                    <p className="mt-1 text-sm text-red-500">{errors.organizationName.message}</p>
                  )}
                </div>
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
                    <Button type="submit" className="w-full" size="lg" isLoading={signupMutation.isPending}>
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

          {/* STEP 2 VIEW - Success */}
          {step === 2 && (
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
                          <span className="text-sm font-medium">Account activated</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                          <div className="w-6 h-6 rounded-full bg-brand-lavender flex items-center justify-center flex-shrink-0">
                             <CheckCircle2 className="h-4 w-4 text-brand-purple" />
                          </div>
                          <span className="text-sm font-medium">Workspace ready for setup</span>
                      </div>
                  </div>

                  <Button
                    onClick={goToDashboard}
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
