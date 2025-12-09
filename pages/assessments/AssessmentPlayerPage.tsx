import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAssessmentStore } from '../../store/assessmentStore';
import { QuestionRenderer } from '../../components/assessment/QuestionRenderer';
import { ProgressBar } from '../../components/assessment/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/Card';

export const AssessmentPlayerPage = () => {
  const navigate = useNavigate();
  const { 
    activeAssessment, 
    currentQuestionIndex, 
    responses, 
    isFinished,
    nextQuestion, 
    prevQuestion, 
    submitAnswer,
    finishAssessment 
  } = useAssessmentStore();

  if (!activeAssessment) {
    return <Navigate to="/assessments" replace />;
  }

  if (isFinished) {
    return <Navigate to={`/assessments/${activeAssessment.id}/results`} replace />;
  }

  const currentQuestion = activeAssessment.questions[currentQuestionIndex];
  const currentAnswer = responses[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === activeAssessment.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleNext = () => {
    if (isLastQuestion) {
      finishAssessment();
      navigate(`/assessments/${activeAssessment.id}/results`);
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header with Progress */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/assessments')} 
            className="pl-0 hover:bg-transparent hover:text-brand-purple"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Exit Assessment
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm font-bold text-brand-purple bg-brand-lavender px-4 py-1.5 rounded-full shadow-sm border border-brand-purple/10">
                <Clock className="h-4 w-4 mr-2" />
                14:22
            </div>
          </div>
        </div>
        
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={activeAssessment.questions.length} 
        />
      </div>

      {/* Main Question Card */}
      <Card className="min-h-[500px] flex flex-col rounded-[24px] shadow-xl border-slate-100 overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-white pt-8 pb-6 px-8 relative">
          <div className="absolute top-8 right-8">
             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-pink text-white font-bold text-sm shadow-md">
                {currentQuestionIndex + 1}
             </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
               Question {currentQuestionIndex + 1} of {activeAssessment.questions.length}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight pr-12">
              {currentQuestion.text}
            </h2>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 py-8 px-8 bg-white">
          <QuestionRenderer 
            question={currentQuestion}
            value={currentAnswer}
            onChange={(val) => submitAnswer(currentQuestion.id, val)}
          />
        </CardContent>

        <CardFooter className="flex justify-between items-center py-6 px-8 bg-slate-50 border-t border-slate-100">
          <Button 
            variant="secondary" 
            onClick={prevQuestion} 
            disabled={isFirstQuestion}
            className="border-slate-300 text-slate-600 hover:bg-white hover:text-brand-purple hover:border-brand-purple/30"
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={currentQuestion.required && !currentAnswer}
            className={isLastQuestion 
                ? "bg-gradient-to-r from-brand-turquoise to-teal-400 hover:from-brand-turquoise hover:to-teal-500 text-white shadow-lg shadow-brand-turquoise/25 hover:shadow-brand-turquoise/40 px-8" 
                : "bg-gradient-to-r from-brand-purple to-brand-darkPurple hover:from-brand-purple hover:to-indigo-600 text-white shadow-lg shadow-brand-purple/25 hover:shadow-brand-purple/40 px-8"
            }
          >
            {isLastQuestion ? (
              <>
                Submit Assessment
                <CheckCircle2 className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Next Question
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-center space-x-2 text-xs font-medium text-slate-400">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
        <span>Progress auto-saved</span>
      </div>
    </div>
  );
};