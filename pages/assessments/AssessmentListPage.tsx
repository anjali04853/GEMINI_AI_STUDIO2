import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { AssessmentCard } from '../../components/assessment/AssessmentCard';
import { mockAssessments } from '../../data/mockAssessments';
import { useAssessmentStore } from '../../store/assessmentStore';
import { Assessment } from '../../types';
import { cn } from '../../lib/utils';

export const AssessmentListPage = () => {
  const navigate = useNavigate();
  const startAssessment = useAssessmentStore(state => state.startAssessment);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('All');

  const handleStart = (assessment: Assessment) => {
    startAssessment(assessment);
    navigate(`/assessments/${assessment.id}`);
  };

  const categories = ['All', 'Technical', 'Soft Skills', 'Leadership'];

  const filteredAssessments = mockAssessments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || a.category.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
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
          {filteredAssessments.length > 0 ? (
            filteredAssessments.map((assessment) => (
              <AssessmentCard 
                key={assessment.id} 
                assessment={assessment} 
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
  );
};