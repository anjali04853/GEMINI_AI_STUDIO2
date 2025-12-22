import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Check, BarChart3, Clock, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useInterviewStore } from '../../store/interviewStore';
import { useStartQuiz } from '../../hooks/api/useInterviewsApi';
import { useToast } from '../../components/ui/Toast';
import { getApiError } from '../../lib/api/client';
import { InterviewDifficulty } from '../../types';
import { cn } from '../../lib/utils';

const TOPICS = ['React', 'JavaScript', 'CSS', 'System Design'];
const DIFFICULTIES: InterviewDifficulty[] = ['Easy', 'Medium', 'Hard'];

export const QuizSetupPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setActiveQuiz = useInterviewStore(state => state.setActiveQuiz);
  const startQuizMutation = useStartQuiz();

  const [selectedTopics, setSelectedTopics] = useState<string[]>(['React']);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(0); // 0 = unlimited

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleStart = async () => {
    if (selectedTopics.length === 0) return;

    const config = {
      topics: selectedTopics,
      difficulty,
      questionCount,
      timeLimit
    };

    try {
      const session = await startQuizMutation.mutateAsync({
        topics: selectedTopics,
        difficulty,
        questionCount,
        timeLimit,
      });

      // Transform API questions to local format and set in store
      const questions = session.questions.map((q: any) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        topic: q.topic || selectedTopics[0],
        explanation: q.explanation,
      }));

      setActiveQuiz(session.sessionId, config, questions);
      navigate('/dashboard/interview/quiz');
    } catch (error) {
      const apiError = getApiError(error);
      showToast({
        title: 'Failed to start quiz',
        description: apiError.message,
        variant: 'error',
      });
    }
  };

  const getDifficultyColor = (diff: string) => {
      switch(diff) {
          case 'Easy': return 'bg-green-400 border-green-400';
          case 'Medium': return 'bg-brand-yellow border-brand-yellow';
          case 'Hard': return 'bg-brand-pink border-brand-pink';
          default: return 'bg-slate-300';
      }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/interview')} className="mr-4 text-slate-500 hover:text-brand-purple">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Configure Quiz</h1>
      </div>

      <Card className="border-t-4 border-brand-purple shadow-lg rounded-[20px]">
        <CardHeader className="bg-brand-offWhite border-b border-slate-100 rounded-t-[16px]">
          <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
             <div className="p-2 bg-brand-lavender rounded-lg">
                <Layers className="h-5 w-5 text-brand-purple" />
             </div>
             Quiz Settings
          </CardTitle>
          <CardDescription>Customize your practice session to focus on specific areas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          
          {/* Topics */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Select Topics</label>
            <div className="flex flex-wrap gap-3">
              {TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border-2 flex items-center",
                    selectedTopics.includes(topic)
                      ? "bg-brand-purple text-white border-brand-purple shadow-md scale-105"
                      : "bg-white text-slate-600 border-slate-200 hover:border-brand-purple/50 hover:bg-brand-lavender/30"
                  )}
                >
                  {topic}
                  {selectedTopics.includes(topic) && <Check className="ml-2 h-3 w-3" />}
                </button>
              ))}
            </div>
            {selectedTopics.length === 0 && (
              <p className="text-xs text-red-500 font-medium">Please select at least one topic.</p>
            )}
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Difficulty */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Difficulty Level</label>
            <div className="flex gap-4">
              {DIFFICULTIES.map(diff => (
                <label
                  key={diff}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      difficulty === diff ? getDifficultyColor(diff) : "border-slate-300 bg-white"
                  )}>
                      {difficulty === diff && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                  </div>
                  <span className={cn("text-sm font-medium transition-colors", difficulty === diff ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700")}>
                      {diff}
                  </span>
                  <input 
                      type="radio" 
                      name="difficulty" 
                      value={diff} 
                      checked={difficulty === diff}
                      onChange={() => setDifficulty(diff)}
                      className="hidden"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Question Count */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Number of Questions</label>
              <div className="h-8 w-12 bg-brand-lavender text-brand-purple rounded-md flex items-center justify-center font-bold text-sm">
                  {questionCount}
              </div>
            </div>
            <div className="relative pt-2">
                <input
                type="range"
                min="5"
                max="20"
                step="1"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Time Limit */}
          <div className="space-y-4">
             <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Time Limit</label>
             <div className="grid grid-cols-4 gap-3">
               {[0, 5, 10, 15].map(min => (
                 <button
                   key={min}
                   onClick={() => setTimeLimit(min)}
                   className={cn(
                     "py-3 rounded-xl text-sm font-medium transition-all border-2",
                     timeLimit === min
                       ? "border-brand-purple bg-brand-lavender/30 text-brand-purple"
                       : "bg-white text-slate-500 border-slate-100 hover:border-brand-purple/30 hover:bg-slate-50"
                   )}
                 >
                   <div className="flex flex-col items-center gap-1">
                      <Clock className={cn("h-4 w-4", timeLimit === min ? "text-brand-purple" : "text-slate-400")} />
                      {min === 0 ? 'Unlimited' : `${min} min`}
                   </div>
                 </button>
               ))}
             </div>
          </div>

        </CardContent>
        <CardFooter className="p-8 pt-0">
          <Button
            className="w-full h-14 text-lg uppercase tracking-wide font-bold bg-gradient-to-r from-brand-turquoise to-teal-400 hover:from-teal-400 hover:to-brand-turquoise shadow-lg shadow-brand-turquoise/30 hover:scale-[1.02] transition-all rounded-xl"
            onClick={handleStart}
            disabled={selectedTopics.length === 0 || startQuizMutation.isPending}
            isLoading={startQuizMutation.isPending}
          >
            Start Quiz
            <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
