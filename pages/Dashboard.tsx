import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { Activity, Brain, Mic, Trophy, ArrowUpRight } from 'lucide-react';
import { OnboardingTour } from '../components/OnboardingTour';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useAnalyticsSummary, useActivityHistory } from '../hooks/api/useAnalyticsApi';

// Helper function to format timestamps as relative time
const formatTimeAgo = (timestamp: string | number): string => {
  const now = Date.now();
  const date = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
};

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: historyData, isLoading: historyLoading } = useActivityHistory({ limit: 3 });

  const isLoading = summaryLoading || historyLoading;

  const themeClasses = {
    purple: "border-t-4 border-accent hover:shadow-accent/10",
    pink: "border-t-4 border-brand-pink hover:shadow-brand-pink/10",
    turquoise: "border-t-4 border-brand-turquoise hover:shadow-brand-turquoise/10",
    sky: "border-t-4 border-brand-sky hover:shadow-brand-sky/10",
  };

  const iconBgClasses = {
    purple: "bg-accent-light text-accent",
    pink: "bg-pink-50 dark:bg-pink-900/20 text-brand-pink",
    turquoise: "bg-teal-50 dark:bg-teal-900/20 text-brand-turquoise",
    sky: "bg-sky-50 dark:bg-sky-900/20 text-brand-sky",
  };

  const stats = [
    {
      title: "Total Activities",
      value: summary ? `${summary.totalActivities} Completed` : "0 Completed",
      description: `Avg Score: ${summary?.averageScore?.toFixed(0) || 0}%`,
      icon: Brain,
      theme: "purple" as const,
      link: "/dashboard/assessments"
    },
    {
      title: "Practice Time",
      value: summary?.totalHours || "0h",
      description: `${summary?.sessionsThisWeek || 0} sessions this week`,
      icon: Mic,
      theme: "pink" as const,
      link: "/dashboard/interview"
    },
    {
      title: "Average Score",
      value: `${summary?.averageScore?.toFixed(0) || 0}%`,
      description: "Across all activities",
      icon: Trophy,
      theme: "turquoise" as const,
      link: "/dashboard/analytics"
    },
    {
      title: "Active Streak",
      value: `${summary?.streakDays || 0} Days`,
      description: summary?.streakDays ? "Keep it up!" : "Start practicing!",
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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name}! Here's your daily overview.</p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
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
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
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
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
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
        <Card className="col-span-4 border-t-4 border-accent">
          <CardHeader>
            <CardTitle className="dark:text-white">Recent Activity</CardTitle>
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
            ) : historyData?.activities && historyData.activities.length > 0 ? (
              <div className="space-y-6">
                {historyData.activities.map((activity) => {
                  const getActivityIcon = (type: string) => {
                    switch (type) {
                      case 'assessment': return { icon: Brain, color: "bg-accent-light text-accent" };
                      case 'voice-interview': return { icon: Mic, color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600" };
                      case 'quiz': return { icon: Activity, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" };
                      default: return { icon: Activity, color: "bg-slate-100 dark:bg-slate-700 text-slate-600" };
                    }
                  };
                  const { icon: IconComponent, color } = getActivityIcon(activity.type);
                  const timeAgo = formatTimeAgo(activity.completedAt);

                  return (
                    <div key={activity.id} className="flex items-center group p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center mr-4 shadow-sm", color)}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{activity.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {activity.score ? `Completed with ${activity.score}% score` : activity.description || 'Completed'}
                        </p>
                      </div>
                      <div className="ml-auto text-xs text-slate-400 font-medium">{timeAgo}</div>
                      <ArrowUpRight className="h-4 w-4 text-slate-300 dark:text-slate-600 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1">Start an assessment or interview to see your progress here</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-t-4 border-accent bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="dark:text-white">Recommended For You</CardTitle>
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
                  <div className="p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
                     <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-accent transition-colors">Advanced React Hooks</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Level up your state management skills.</p>
                     <div className="mt-3 flex items-center text-xs font-medium text-accent">
                        Start Lesson <ArrowUpRight className="ml-1 h-3 w-3" />
                     </div>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
                     <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-accent transition-colors">Behavioral Interview Mock</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Practice STAR method responses.</p>
                     <div className="mt-3 flex items-center text-xs font-medium text-accent">
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