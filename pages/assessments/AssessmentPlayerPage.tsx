import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save, Clock, AlertCircle } from 'lucide-react';
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

  // Redirect if no active assessment
  if (!activeAssessment) {
    return <Navigate to="/assessments" replace />;
  }

  // Redirect if already finished
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate('/assessments')} 
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Exit Assessment
          </button>
          <div className="flex items-center text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            <Clock className="h-4 w-4 mr-2" />
            Time Remaining: 14:22
          </div>
        </div>
        
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={activeAssessment.questions.length} 
        />
      </div>

      {/* Main Question Card */}
      <Card className="min-h-[400px] flex flex-col">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Question {currentQuestionIndex + 1}
              </span>
              <h2 className="text-xl font-bold mt-1 text-slate-900">
                {currentQuestion.text}
              </h2>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 py-8">
          <QuestionRenderer 
            question={currentQuestion}
            value={currentAnswer}
            onChange={(val) => submitAnswer(currentQuestion.id, val)}
          />
        </CardContent>

        <CardFooter className="flex justify-between border-t border-slate-100 py-4 bg-slate-50/50">
          <Button 
            variant="outline" 
            onClick={prevQuestion} 
            disabled={isFirstQuestion}
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={currentQuestion.required && !currentAnswer}
            className={isLastQuestion ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isLastQuestion ? (
              <>
                Finish Assessment
                <Save className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next Question
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
        <AlertCircle className="h-3 w-3" />
        <span>Answers are auto-saved locally.</span>
      </div>
    </div>
  );
};