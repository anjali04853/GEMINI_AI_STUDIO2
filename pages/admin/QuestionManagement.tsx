import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search, Filter, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAdminQuestions, useDeleteQuestion } from '../../hooks/api/useAdminApi';
import { useToast } from '../../components/ui/Toast';
import { getApiError } from '../../lib/api/client';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { cn } from '../../lib/utils';

export const QuestionManagement = () => {
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const { data: questionsData, isLoading, error } = useAdminQuestions({
    search: search || undefined,
  });
  const deleteQuestionMutation = useDeleteQuestion();

  const questions = questionsData?.questions || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestionMutation.mutateAsync(id);
      showToast({
        title: 'Question deleted',
        variant: 'success',
      });
    } catch (err) {
      const apiError = getApiError(err);
      showToast({
        title: 'Failed to delete question',
        description: apiError.message,
        variant: 'error',
      });
    }
  };

  const filtered = questions.filter(q =>
    q.text.toLowerCase().includes(search.toLowerCase()) ||
    (q.topic || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Questions</h1>
           <p className="text-slate-500 text-sm mt-1">Manage interview question bank and datasets.</p>
        </div>
        <Button className="bg-brand-purple hover:bg-brand-darkPurple text-white shadow-lg shadow-brand-purple/20">
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search questions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-purple"
          />
        </div>
        <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300">
           <Filter className="mr-2 h-4 w-4" />
           Filters
        </Button>
      </div>

      <Card className="bg-white border-slate-200 overflow-hidden shadow-md">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-slate-700 font-medium">Failed to load questions</h3>
            <p className="text-slate-400 text-sm mt-1">Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Question</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Topic</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Difficulty</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((q: any) => (
                    <tr key={q.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700 line-clamp-2 leading-relaxed group-hover:text-slate-900 transition-colors">{q.text}</p>
                        <div className="flex gap-2 mt-2">
                           {q.options?.slice(0,2).map((opt: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 border border-slate-200">
                                 {i === q.correctOptionIndex && <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />}
                                 {opt.substring(0, 20)}...
                              </span>
                           ))}
                           {q.options?.length > 2 && <span className="text-[10px] text-slate-400 py-0.5">+{q.options.length - 2} more</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                           {q.topic}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                           className={cn(
                              "border",
                              q.difficulty === 'easy' ? "bg-green-500/10 text-green-600 border-green-500/20" :
                              q.difficulty === 'medium' ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                              "bg-red-500/10 text-red-600 border-red-500/20"
                           )}
                        >
                          {q.difficulty}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-brand-sky hover:bg-slate-100">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(q.id)}
                              disabled={deleteQuestionMutation.isPending}
                              className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100"
                            >
                                {deleteQuestionMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
                <div className="p-12 text-center">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-slate-400" />
                   </div>
                   <h3 className="text-slate-700 font-medium">No questions found</h3>
                   <p className="text-slate-400 text-sm mt-1">Try adjusting your search terms.</p>
                </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};