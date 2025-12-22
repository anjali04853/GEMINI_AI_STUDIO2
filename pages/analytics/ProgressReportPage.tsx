import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Share2,
  Award,
  TrendingUp,
  Target,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { SimpleRadarChart } from '../../components/analytics/AnalyticsCharts';
import { useSkillsData, useAnalyticsReport } from '../../hooks/api/useAnalyticsApi';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { Skeleton } from '../../components/ui/Skeleton';

export const ProgressReportPage = () => {
  const { data: skillsData, isLoading: skillsLoading } = useSkillsData();
  const { data: reportData, isLoading: reportLoading } = useAnalyticsReport();
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const isLoading = skillsLoading || reportLoading;

  // Transform skills data for radar chart
  const skillData = skillsData?.skills?.map(skill => ({
    subject: skill.name,
    value: skill.score
  })) || [];

  // Generate previous skill data for comparison (in real app, this would come from API)
  const previousSkillData = skillData.map(s => ({ ...s, value: Math.max(10, s.value - Math.floor(Math.random() * 20)) }));

  const milestones = [
    { title: "First Quiz Completed", date: "Jan 10", status: "completed" },
    { title: "React Mastery (80%+)", date: "Jan 24", status: "completed" },
    { title: "Voice Interview Session", date: "Feb 05", status: "completed" },
    { title: "System Design Certificate", date: "Pending", status: "upcoming" },
    { title: "Mock Interview with Expert", date: "Pending", status: "upcoming" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Navigation */}
      <div className="mb-6 flex items-center gap-4">
         <Link to="/dashboard/analytics">
            <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
         </Link>
      </div>

      {/* Report Header */}
      <div className="bg-gradient-to-r from-brand-purple to-indigo-900 rounded-t-3xl p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-xl relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="relative z-10">
             <Badge className="bg-white/20 text-white border-none mb-4 backdrop-blur-sm">Monthly Report</Badge>
             <h1 className="text-4xl font-extrabold tracking-tight mb-1">Your Progress Report</h1>
             <p className="text-indigo-200 text-lg">{currentDate}</p>
         </div>
         <div className="relative z-10 flex gap-3">
             <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                 <Download className="h-4 w-4 mr-2" /> Download PDF
             </Button>
             <Button className="bg-brand-pink hover:bg-pink-600 border-none">
                 <Share2 className="h-4 w-4 mr-2" /> Share
             </Button>
         </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white p-8 border-x border-b border-slate-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Executive Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-xl p-5 border border-green-100 flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <Award className="h-6 w-6" />
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-1">Top Achievement</h4>
                      <p className="text-slate-600 text-sm">You've reached the top 10% in React assessments this month.</p>
                  </div>
              </div>

              <div className="bg-teal-50 rounded-xl p-5 border border-teal-100 flex items-start gap-4">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                      <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-1">Growth Highlight</h4>
                      <p className="text-slate-600 text-sm">Communication score improved by 15% after 3 voice sessions.</p>
                  </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 flex items-start gap-4">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      <Target className="h-6 w-6" />
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-1">Focus Area</h4>
                      <p className="text-slate-600 text-sm">System Design requires more attention to reach the "Advanced" tier.</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Skills Comparison */}
          <div className="lg:col-span-2 space-y-8">
              <Card className="border-t-4 border-brand-purple">
                  <CardHeader>
                      <CardTitle className="text-brand-purple">Skills Evolution</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-8">
                      <div className="text-center">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Last Month</h4>
                          <div className="opacity-60 scale-90">
                             <SimpleRadarChart data={previousSkillData} size={250} />
                          </div>
                      </div>
                      <div className="text-center relative">
                          <h4 className="text-xs font-bold text-brand-purple uppercase tracking-widest mb-4">Current</h4>
                          <SimpleRadarChart data={skillData} size={250} />
                          <div className="absolute top-10 right-0 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                              +12% Overall
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-none shadow-md">
                 <CardHeader>
                    <CardTitle className="text-slate-900 border-b-2 border-brand-turquoise w-fit pb-1">Recommended Actions</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl border-l-4 border-l-brand-pink bg-pink-50/50">
                        <div className="mt-1">
                            <span className="text-xs font-bold bg-brand-pink text-white px-2 py-1 rounded">High Priority</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Complete System Design Mock</h4>
                            <p className="text-sm text-slate-600 mt-1">To balance your technical profile, aim for a score above 75%.</p>
                        </div>
                        <Button size="sm" variant="outline" className="ml-auto border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white">Start</Button>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl border-l-4 border-l-brand-sky bg-sky-50/50">
                        <div className="mt-1">
                            <span className="text-xs font-bold bg-brand-sky text-white px-2 py-1 rounded">Medium</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Review Voice Feedback</h4>
                            <p className="text-sm text-slate-600 mt-1">Check the delivery analysis from your last session.</p>
                        </div>
                        <Button size="sm" variant="outline" className="ml-auto border-brand-sky text-brand-sky hover:bg-brand-sky hover:text-white">View</Button>
                    </div>
                 </CardContent>
              </Card>
          </div>

          {/* Sidebar: Milestones */}
          <div className="space-y-8">
              <Card className="h-full border-none shadow-md bg-slate-50">
                  <CardHeader>
                      <CardTitle>Milestone Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 py-2">
                          {milestones.map((m, i) => (
                              <div key={i} className="relative pl-8">
                                  <div className={cn(
                                      "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white",
                                      m.status === 'completed' ? "border-green-500 text-green-500" : "border-slate-300 text-slate-300"
                                  )}>
                                      {m.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                                  </div>
                                  <h4 className={cn("font-bold text-sm", m.status === 'completed' ? "text-slate-900" : "text-slate-400")}>{m.title}</h4>
                                  <span className="text-xs font-mono text-slate-500">{m.date}</span>
                              </div>
                          ))}
                      </div>
                      
                      <div className="mt-8 bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                          <p className="text-xs text-slate-500 mb-2">Next Badge Unlock</p>
                          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-2 grayscale opacity-50">
                              <Award className="w-8 h-8 text-yellow-500" />
                          </div>
                          <p className="font-bold text-sm text-slate-800">Consistency Master</p>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-yellow-400 w-3/4"></div>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">75% Completed</p>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center border-t border-slate-200 pt-8">
          <p className="text-slate-400 text-sm">Generated on {currentDate} • SkillForge Platform</p>
      </div>

    </div>
  );
};