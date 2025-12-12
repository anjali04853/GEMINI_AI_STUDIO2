import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bot, Shield, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const isAdmin = data.email === 'admin@example.com';
      login(
        { 
          id: isAdmin ? '1' : '2', 
          name: isAdmin ? 'Admin User' : 'Demo User', 
          email: data.email,
          role: isAdmin ? 'admin' : 'user',
          status: 'active',
          joinedAt: Date.now()
        },
        'fake-jwt-token'
      );
      setIsLoading(false);
      navigate(isAdmin ? '/admin' : '/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center sm:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 text-brand-purple mb-8">
              <div className="h-8 w-8 bg-brand-purple rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">SkillForge</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-2 text-slate-500">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-brand-purple focus:ring-brand-purple cursor-pointer accent-brand-purple"
                      {...register('rememberMe')}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-brand-purple hover:text-brand-darkPurple"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="bg-brand-lavender/50 p-4 rounded-xl border border-brand-purple/10 flex items-start gap-3">
              <Shield className="h-5 w-5 text-brand-purple mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <p><strong>Admin:</strong> admin@example.com</p>
                <p><strong>User:</strong> any other email</p>
              </div>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-purple hover:text-brand-darkPurple transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple via-brand-darkPurple to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white h-full max-w-2xl">
           <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit border border-white/20">
              <Bot className="h-10 w-10 text-brand-turquoise" />
           </div>
           <h2 className="text-4xl font-bold mb-6 leading-tight">
              Unlock your potential with AI-driven insights.
           </h2>
           <p className="text-lg text-slate-300 leading-relaxed">
              Join thousands of developers mastering their craft through intelligent assessments and real-time coaching.
           </p>
           
           {/* Decorative floating elements */}
           <div className="absolute top-1/4 right-10 w-20 h-20 bg-brand-turquoise rounded-full blur-2xl opacity-20 animate-pulse-glow"></div>
           <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-brand-pink rounded-full blur-3xl opacity-20 animate-blob"></div>
        </div>
      </div>
    </div>
  );
};