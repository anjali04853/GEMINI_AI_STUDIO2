import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { Activity, CreditCard, DollarSign, Users, Brain, Mic, BarChart, Trophy, ArrowUpRight } from 'lucide-react';
import { OnboardingTour } from '../components/OnboardingTour';
import { Skeleton } from '../components/ui/Skeleton';
import { Tooltip } from '../components/ui/Tooltip';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay for dashboard data
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const themeClasses = {
    purple: "border-t-4 border-brand-purple hover:shadow-brand-purple/10",
    pink: "border-t-4 border-brand-pink hover:shadow-brand-pink/10",
    turquoise: "border-t-4 border-brand-turquoise hover:shadow-brand-turquoise/10",
    sky: "border-t-4 border-brand-sky hover:shadow-brand-sky/10",
  };

  const iconBgClasses = {
    purple: "bg-brand-lavender text-brand-purple",
    pink: "bg-pink-50 text-brand-pink",
    turquoise: "bg-teal-50 text-brand-turquoise",
    sky: "bg-sky-50 text-brand-sky",
  };

  const stats = [
    {
      title: "Assessments",
      value: "4 Completed",
      description: "Top 15% in React",
      icon: Brain,
      theme: "purple" as const,
      link: "/dashboard/assessments"
    },
    {
      title: "Interview Prep",
      value: "12 Sessions",
      description: "Avg Score: 85%",
      icon: Mic,
      theme: "pink" as const,
      link: "/dashboard/interview"
    },
    {
      title: "Skills Growth",
      value: "+24%",
      description: "Since last month",
      icon: Trophy,
      theme: "turquoise" as const,
      link: "/dashboard/analytics"
    },
    {
      title: "Active Streak",
      value: "5 Days",
      description: "Keep it up!",
      icon: Activity,
      theme: "sky" as const,
      link: "/dashboard/analytics"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <OnboardingTour />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">Welcome back, {user?.name}! Here's your daily overview.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           System Operational
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link} className="block group">
            <Card className={cn(
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer h-full relative overflow-hidden",
                themeClasses[stat.theme]
            )}>
              {/* Optional Ribbon for 'New' or 'Hot' - Simulated here */}
              {index === 1 && (
                 <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-brand-yellow shadow-[0_0_8px_rgba(252,211,77,0.8)]"></div>
              )}

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-full transition-transform group-hover:scale-110", iconBgClasses[stat.theme])}>
                   <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ) : (
                  <div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                         {stat.description}
                      </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-t-4 border-slate-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest interactions across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4">
                       <Skeleton className="h-10 w-10 rounded-full" />
                       <div className="space-y-2 flex-1">
                         <Skeleton className="h-4 w-1/3" />
                         <Skeleton className="h-3 w-1/4" />
                       </div>
                    </div>
                  ))}
               </div>
            ) : (
              <div className="space-y-6">
                {[
                    { title: "React Assessment", desc: "Completed with 92% score", time: "2h ago", icon: Brain, color: "bg-brand-lavender text-brand-purple" },
                    { title: "Voice Practice", desc: "Recorded 'Tell me about yourself'", time: "5h ago", icon: Mic, color: "bg-orange-100 text-orange-600" },
                    { title: "System Design Quiz", desc: "Attempted 10 questions", time: "1d ago", icon: Activity, color: "bg-blue-100 text-blue-600" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center mr-4 shadow-sm", item.color)}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                    </div>
                    <div className="ml-auto text-xs text-slate-400 font-medium">{item.time}</div>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-t-4 border-slate-200 bg-gradient-to-br from-white to-slate-50">
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
            <CardDescription>
              Based on your recent performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="space-y-4">
                   <Skeleton className="h-24 w-full rounded-lg" />
                   <Skeleton className="h-24 w-full rounded-lg" />
                </div>
             ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-purple"></div>
                     <h4 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-brand-purple transition-colors">Advanced React Hooks</h4>
                     <p className="text-xs text-slate-500">Level up your state management skills.</p>
                     <div className="mt-3 flex items-center text-xs font-medium text-brand-purple">
                        Start Lesson <ArrowUpRight className="ml-1 h-3 w-3" />
                     </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-pink"></div>
                     <h4 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-brand-pink transition-colors">Behavioral Interview Mock</h4>
                     <p className="text-xs text-slate-500">Practice STAR method responses.</p>
                     <div className="mt-3 flex items-center text-xs font-medium text-brand-pink">
                        Start Practice <ArrowUpRight className="ml-1 h-3 w-3" />
                     </div>
                  </div>
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};