import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { AssessmentCard } from '../../components/assessment/AssessmentCard';
import { mockAssessments } from '../../data/mockAssessments';
import { useAssessmentStore } from '../../store/assessmentStore';
import { Assessment } from '../../types';

export const AssessmentListPage = () => {
  const navigate = useNavigate();
  const startAssessment = useAssessmentStore(state => state.startAssessment);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleStart = (assessment: Assessment) => {
    startAssessment(assessment);
    navigate(`/assessments/${assessment.id}`);
  };

  const filteredAssessments = mockAssessments.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Skill Assessments</h1>
          <p className="text-slate-500">Validate your skills and get personalized career recommendations.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search assessments..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map((assessment) => (
            <AssessmentCard 
              key={assessment.id} 
              assessment={assessment} 
              onStart={handleStart} 
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            No assessments found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};