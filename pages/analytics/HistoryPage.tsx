import React, { useState } from 'react';
import {
  Search,
  ChevronLeft,
  Calendar,
  Clock,
  ArrowUpRight,
  Trash2,
  Share2,
  Eye,
  MoreVertical,
  Activity,
  Bot,
  Mic,
  MessageSquare,
  Award,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useActivityHistory } from '../../hooks/api/useAnalyticsApi';
import { cn } from '../../lib/utils';
import { Tooltip } from '../../components/ui/Tooltip';
import { Skeleton } from '../../components/ui/Skeleton';

export const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [page, setPage] = useState(1);

  const { data: historyData, isLoading, error } = useActivityHistory({
    type: filterType !== 'All' ? filterType : undefined,
    limit: 10,
    offset: (page - 1) * 10,
  });

  const activities = historyData?.activities || [];

  // Filter by search term (client-side filtering for search)
  const filtered = activities.filter((item: any) => {
    const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const types = ['All', 'Technical Quiz', 'Assessment', 'Text Interview', 'Voice Interview', 'Bot Interview'];

  const getModeStyles = (type: string) => {
      switch(type) {
          case 'Technical Quiz': return { border: 'border-l-brand-purple', icon: Award, color: 'text-brand-purple', bg: 'bg-brand-lavender' };
          case 'Text Interview': return { border: 'border-l-brand-pink', icon: MessageSquare, color: 'text-brand-pink', bg: 'bg-pink-50' };
          case 'Voice Interview': return { border: 'border-l-brand-turquoise', icon: Mic, color: 'text-brand-turquoise', bg: 'bg-teal-50' };
          case 'Bot Interview': return { border: 'border-l-brand-sky', icon: Bot, color: 'text-brand-sky', bg: 'bg-sky-50' };
          case 'Assessment': return { border: 'border-l-green-500', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' };
          default: return { border: 'border-l-slate-300', icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' };
      }
  };

  const getScoreColor = (score: number) => {
      if (score >= 80) return "text-green-600 border-green-200 bg-green-50";
      if (score >= 60) return "text-brand-turquoise border-brand-turquoise/30 bg-teal-50";
      return "text-orange-500 border-orange-200 bg-orange-50";
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      
      <div className="flex items-center gap-4">
        <Link to="/dashboard/analytics">
          <Button variant="ghost" size="sm" className="hover:bg-slate-100">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Session History</h1>
      </div>

      {/* Filters Bar */}
      <div className="bg-brand-offWhite p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80 group">
           <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-brand-purple transition-colors" />
           <Input 
             placeholder="Search topics..." 
             className="pl-10 border-slate-200 focus:border-brand-purple focus:ring-brand-purple/20 bg-white"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
           {types.map(t => (
             <button
               key={t}
               onClick={() => setFilterType(t)}
               className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full whitespace-nowrap transition-all border",
                  filterType === t 
                    ? "bg-brand-purple text-white border-brand-purple shadow-md" 
                    : "bg-white border-slate-200 text-slate-500 hover:border-brand-purple/50 hover:text-brand-purple"
               )}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-4">
        {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-5 flex gap-6 items-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-14 w-14 rounded-full" />
                </div>
              ))}
            </div>
        ) : error ? (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-red-200">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-red-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Failed to load history</h3>
                <p className="text-slate-500">Please try again later.</p>
            </div>
        ) : filtered.length > 0 ? (
            filtered.map((item: any) => {
                const style = getModeStyles(item.type);
                const score = item.score !== undefined ? item.score : 0;

                return (
                    <div
                        key={item.id}
                        className={cn(
                            "bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-l-[6px] p-5 flex flex-col md:flex-row gap-6 md:items-center group",
                            style.border
                        )}
                    >
                        {/* Header Section */}
                        <div className="flex items-start gap-4 md:w-1/3">
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", style.bg)}>
                                <style.icon className={cn("h-6 w-6", style.color)} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                                    {item.title || 'Practice Session'}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    <span>{item.type}</span>
                                    <span>•</span>
                                    <span>{new Date(item.completedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Body */}
                        <div className="flex-1 flex items-center justify-between md:justify-around border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 pl-0 md:pl-6">
                            <div className="text-center">
                                <div className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center border-4 text-sm font-black mx-auto mb-1",
                                    getScoreColor(score)
                                )}>
                                    {score}%
                                </div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Score</span>
                            </div>

                            <div className="text-center">
                                <Clock className="h-5 w-5 text-slate-300 mx-auto mb-1" />
                                <span className="text-sm font-bold text-slate-700">
                                    {item.duration ? `${Math.floor(item.duration / 60)}m` : '15m'}
                                </span>
                                <div className="text-[10px] text-slate-400 uppercase font-bold">Duration</div>
                            </div>

                            <div className="text-center hidden sm:block">
                                <Award className="h-5 w-5 text-slate-300 mx-auto mb-1" />
                                <span className="text-sm font-bold text-slate-700">
                                    {item.questionCount || 5}
                                </span>
                                <div className="text-[10px] text-slate-400 uppercase font-bold">Questions</div>
                            </div>
                        </div>

                        {/* Actions Footer (Right aligned on desktop) */}
                        <div className="flex items-center justify-end gap-2 md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                             <Tooltip content="View Results">
                                <Link
                                    to={
                                        item.type === 'quiz' ? `/dashboard/interview/results?session=${item.id}` :
                                        item.type === 'assessment' ? `/dashboard/assessments/${item.assessmentId}/results` :
                                        item.type === 'text-interview' ? `/dashboard/interview/text/results?session=${item.id}` :
                                        item.type === 'voice-interview' ? `/dashboard/interview/voice/results?session=${item.id}` :
                                        `/dashboard/interview/bot/results?session=${item.id}`
                                    }
                                >
                                    <Button variant="ghost" size="sm" className="text-brand-purple hover:bg-brand-lavender">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Review
                                    </Button>
                                </Link>
                             </Tooltip>

                             <div className="h-6 w-px bg-slate-200 mx-1"></div>

                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand-sky">
                                 <Share2 className="h-4 w-4" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                                 <Trash2 className="h-4 w-4" />
                             </Button>
                        </div>
                    </div>
                );
            })
        ) : (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No sessions found</h3>
                <p className="text-slate-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
        )}
      </div>

      {/* Pagination (Mock) */}
      {filtered.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled className="text-slate-400">Previous</Button>
              <div className="flex gap-1">
                  <button className="w-8 h-8 rounded-lg bg-brand-purple text-white font-bold text-sm">1</button>
                  <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm">2</button>
                  <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm">3</button>
              </div>
              <Button variant="outline" size="sm" className="text-brand-turquoise border-brand-turquoise/30">Next</Button>
          </div>
      )}

    </div>
  );
};