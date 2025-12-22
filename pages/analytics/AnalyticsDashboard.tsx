import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  Activity,
  Clock,
  Target,
  TrendingUp,
  Award,
  Calendar,
  ArrowRight,
  Flame,
  FileText,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAnalyticsSummary, useSkillsData, useActivityData } from '../../hooks/api/useAnalyticsApi';
import { SimpleBarChart, SimpleRadarChart, SimpleTrendChart, HorizontalBarChart, DonutChart } from '../../components/analytics/AnalyticsCharts';
import { cn } from '../../lib/utils';
import { Tooltip } from '../../components/ui/Tooltip';
import { Skeleton } from '../../components/ui/Skeleton';

export const AnalyticsDashboard = () => {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: skillsData, isLoading: skillsLoading } = useSkillsData();
  const { data: activityData, isLoading: activityLoading } = useActivityData({ days: 7 });

  const isLoading = summaryLoading || skillsLoading || activityLoading;

  // Extract values from API response with fallbacks
  const totalActivities = summary?.totalActivities || 0;
  const averageScore = summary?.averageScore || 0;
  const totalHours = summary?.totalHours || '0';
  const streakDays = summary?.streakDays || 0;
  const improvement = summary?.improvement || 0;

  // Transform skills data for radar chart
  const skillData = skillsData?.skills?.map(skill => ({
    subject: skill.name,
    value: skill.score
  })) || [];

  // Mock data for new charts
  const trendData = [65, 68, 72, 70, 75, 78, 82, 85, 84, 88];
  
  const topicPerformance = [
    { label: 'React Hooks', value: 92, gradientFrom: '#4ade80', gradientTo: '#22c55e' }, // Green
    { label: 'System Design', value: 78, gradientFrom: '#2dd4bf', gradientTo: '#0ea5e9' }, // Teal to Sky
    { label: 'CSS Layouts', value: 85, gradientFrom: '#4ECDC4', gradientTo: '#2dd4bf' }, // Turquoise
    { label: 'Behavioral', value: 65, gradientFrom: '#f97316', gradientTo: '#facc15' }, // Orange to Yellow
  ];

  const modeDistribution = [
    { label: 'Quiz', value: 12, color: '#6C63FF' },
    { label: 'Text', value: 8, color: '#FF6B9D' },
    { label: 'Voice', value: 5, color: '#4ECDC4' },
    { label: 'Bot', value: 3, color: '#0EA5E9' },
  ];

  // Mock Heatmap Data (approx 12 weeks x 7 days)
  const heatmapData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 4)); 

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header & Date Range */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time insights into your learning journey.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
               <button className="px-3 py-1 rounded-md bg-white shadow-sm text-brand-purple">7 Days</button>
               <button className="px-3 py-1 rounded-md text-slate-500 hover:text-slate-900">30 Days</button>
               <button className="px-3 py-1 rounded-md text-slate-500 hover:text-slate-900">3 Months</button>
            </div>
            <Link to="/dashboard/analytics/report">
                <Button className="bg-brand-purple hover:bg-brand-darkPurple shadow-lg shadow-brand-purple/20">
                    <FileText className="mr-2 h-4 w-4" />
                    Full Report
                </Button>
            </Link>
        </div>
      </div>

      {/* Header Statistics - Row of Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-brand-purple/10 rounded-full text-brand-purple ring-4 ring-brand-purple/5">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Sessions</p>
              <h3 className="text-2xl font-black text-slate-900">{totalActivities}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-brand-turquoise/10 rounded-full text-brand-turquoise ring-4 ring-brand-turquoise/5">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Avg Score</p>
              <h3 className="text-2xl font-black text-slate-900">{averageScore}%</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-green-100 rounded-full text-green-600 ring-4 ring-green-50">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Improvement</p>
              <div className="flex items-center">
                 {isLoading ? (
                   <Skeleton className="h-8 w-16" />
                 ) : (
                   <>
                     <h3 className="text-2xl font-black text-slate-900">{improvement >= 0 ? '+' : ''}{improvement}%</h3>
                     <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded flex items-center">
                        <ArrowRight className="h-3 w-3 -rotate-45 mr-0.5" /> This Week
                     </span>
                   </>
                 )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-4 bg-brand-yellow/20 rounded-full text-yellow-600 ring-4 ring-brand-yellow/10">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Streak</p>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <h3 className="text-2xl font-black text-slate-900">{streakDays} Days</h3>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Section */}
      <Card className="border-none shadow-md">
         <CardHeader>
            <CardTitle className="text-brand-purple">Activity Heatmap</CardTitle>
            <CardDescription>Visualizing your consistency over the last 3 months.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
               {heatmapData.map((level, i) => (
                   <Tooltip key={i} content={`${level * 2} sessions`} className="cursor-help">
                       <div className={cn(
                           "w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all hover:scale-125",
                           level === 0 ? "bg-slate-100" :
                           level === 1 ? "bg-brand-lavender" :
                           level === 2 ? "bg-brand-purple/50" :
                           "bg-brand-purple"
                       )}></div>
                   </Tooltip>
               ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 justify-end">
                <span>Less</span>
                <div className="w-3 h-3 bg-slate-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-brand-lavender rounded-sm"></div>
                <div className="w-3 h-3 bg-brand-purple/50 rounded-sm"></div>
                <div className="w-3 h-3 bg-brand-purple rounded-sm"></div>
                <span>More</span>
            </div>
         </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Trend Chart */}
          <Card className="lg:col-span-2 border-none shadow-md">
             <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-800 border-b-2 border-brand-turquoise pb-1">Score Trend</CardTitle>
                </div>
                <CardDescription>Your performance trajectory over the last 10 sessions.</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
                <SimpleTrendChart data={trendData} height={250} />
             </CardContent>
          </Card>

          {/* Topic Performance */}
          <Card className="border-none shadow-md">
             <CardHeader>
                <CardTitle className="text-slate-800">Topic Performance</CardTitle>
                <CardDescription>Breakdown by subject area.</CardDescription>
             </CardHeader>
             <CardContent>
                <HorizontalBarChart data={topicPerformance} />
             </CardContent>
          </Card>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mode Comparison (Donut) */}
          <Card className="border-none shadow-md">
             <CardHeader>
                <CardTitle className="text-slate-800">Mode Preference</CardTitle>
                <CardDescription>Distribution of your practice sessions.</CardDescription>
             </CardHeader>
             <CardContent className="flex flex-col items-center">
                <DonutChart data={modeDistribution} size={220} />
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6">
                    {modeDistribution.map((mode, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                             <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mode.color }}></span>
                             {mode.label}
                        </div>
                    ))}
                </div>
             </CardContent>
          </Card>

          {/* Skills Radar */}
          <Card className="border-2 border-brand-lavender/30 border-dashed shadow-sm">
             <CardHeader>
                <CardTitle className="text-slate-800">Skill Radar</CardTitle>
                <CardDescription>Balanced assessment of your competencies.</CardDescription>
             </CardHeader>
             <CardContent className="flex justify-center pb-2">
                <SimpleRadarChart data={skillData} size={280} />
             </CardContent>
          </Card>
      </div>
      
      {/* History Link */}
      <div className="flex justify-center">
         <Link to="/dashboard/analytics/history">
            <Button variant="outline" className="text-slate-500 hover:text-brand-purple border-slate-200">
                View Full Session History
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
         </Link>
      </div>

    </div>
  );
};