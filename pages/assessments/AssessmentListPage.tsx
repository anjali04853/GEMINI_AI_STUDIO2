import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles, Clock, BarChart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { AssessmentCard } from '../../components/assessment/AssessmentCard';
import { useAssessmentsList, useStartAssessment } from '../../hooks/api/useAssessmentsApi';
import { useAssessmentStore } from '../../store/assessmentStore';
import { Assessment } from '../../types';
import { cn } from '../../lib/utils';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { getApiError } from '../../lib/api/client';
import type { AssessmentListItem } from '../../lib/api/types';

// Convert API response to local Assessment type
const mapApiToAssessment = (item: AssessmentListItem): Assessment => ({
  id: item.id,
  title: item.title,
  description: item.description,
  durationMinutes: item.durationMinutes,
  category: item.category,
  difficulty: item.difficulty,
  questions: [], // Questions are loaded when starting assessment
});

export const AssessmentListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setActiveAssessment = useAssessmentStore(state => state.setActiveAssessment);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentListItem | null>(null);

  const { data: assessmentsData, isLoading, error } = useAssessmentsList({
    category: activeFilter !== 'All' ? activeFilter : undefined,
  });
  const startAssessmentMutation = useStartAssessment();

  const handleStart = (assessment: Assessment) => {
    const apiAssessment = assessmentsData?.assessments?.find(a => a.id === assessment.id);
    if (apiAssessment) {
      setSelectedAssessment(apiAssessment);
    }
  };

  const confirmStart = async () => {
    if (!selectedAssessment) return;

    try {
      const session = await startAssessmentMutation.mutateAsync(selectedAssessment.id);

      // Store session info in the assessment store for the player page
      setActiveAssessment({
        ...mapApiToAssessment(selectedAssessment),
        questions: session.questions.map(q => ({
          id: q.id,
          type: q.type as Assessment['questions'][0]['type'],
          text: q.text,
          options: q.options,
        })),
      }, session.sessionId);

      navigate(`/dashboard/assessments/${selectedAssessment.id}`);
    } catch (error) {
      const apiError = getApiError(error);
      showToast({
        title: 'Failed to start assessment',
        description: apiError.message,
        variant: 'error',
      });
    }
  };

  const categories = ['All', 'Technical', 'Soft Skills', 'Leadership'];

  const assessments = assessmentsData?.assessments || [];
  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || a.category.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <>
    {/* Start Assessment Modal */}
    <Modal 
      isOpen={!!selectedAssessment} 
      onClose={() => setSelectedAssessment(null)} 
      title="Start Assessment"
      size="lg"
    >
      {selectedAssessment && (
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedAssessment.title}</h3>
            <p className="text-slate-600">{selectedAssessment.description}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <Clock className="h-5 w-5 text-brand-purple mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">{selectedAssessment.durationMinutes} min</p>
              <p className="text-xs text-slate-500">Duration</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <BarChart className="h-5 w-5 text-brand-turquoise mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">{selectedAssessment.questionCount}</p>
              <p className="text-xs text-slate-500">Questions</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <CheckCircle className="h-5 w-5 text-brand-pink mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">{selectedAssessment.difficulty}</p>
              <p className="text-xs text-slate-500">Difficulty</p>
            </div>
          </div>
          
          <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-800 mb-1">Instructions</p>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Answer all questions within the time limit</li>
                  <li>• You can flag questions to review later</li>
                  <li>• Progress is auto-saved every 30 seconds</li>
                  <li>• You cannot go back after submitting</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setSelectedAssessment(null)} className="flex-1" disabled={startAssessmentMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={confirmStart} className="flex-1" isLoading={startAssessmentMutation.isPending}>
              Start Now
            </Button>
          </div>
        </div>
      )}
    </Modal>
    
    <div className="relative min-h-[calc(100vh-100px)]">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-brand-turquoise/5 rounded-full blur-3xl"></div>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
               <span className="p-1.5 bg-brand-yellow/20 rounded-lg">
                 <Sparkles className="h-4 w-4 text-yellow-600" />
               </span>
               <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Skill Check</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Discover Your Potential
            </h1>
            <p className="text-lg text-slate-600">
              Validate your skills with our adaptive assessments and get personalized career recommendations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-purple transition-colors" />
              <Input 
                placeholder="Search assessments..." 
                className="pl-10 h-11 rounded-xl border-slate-200 focus:border-brand-purple focus:ring-brand-purple/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                activeFilter === cat
                  ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:border-brand-purple/30 hover:bg-brand-lavender/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-purple mx-auto mb-4" />
              <p className="text-slate-500">Loading assessments...</p>
            </div>
          ) : error ? (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Failed to load assessments</h3>
              <p className="text-slate-500 mt-1">Please try again later.</p>
            </div>
          ) : filteredAssessments.length > 0 ? (
            filteredAssessments.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={{
                  ...mapApiToAssessment(assessment),
                  questions: Array(assessment.questionCount).fill({ id: '', type: 'multiple-choice', text: '' }),
                }}
                onStart={handleStart}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Filter className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No assessments found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};