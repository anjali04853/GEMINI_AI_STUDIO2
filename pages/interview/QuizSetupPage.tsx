import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useInterviewStore } from '../../store/interviewStore';
import { InterviewDifficulty } from '../../types';
import { cn } from '../../lib/utils';

const TOPICS = ['React', 'JavaScript', 'CSS', 'System Design'];
const DIFFICULTIES: InterviewDifficulty[] = ['Easy', 'Medium', 'Hard'];

export const QuizSetupPage = () => {
  const navigate = useNavigate();
  const startQuiz = useInterviewStore(state => state.startQuiz);

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

  const handleStart = () => {
    if (selectedTopics.length === 0) return;
    
    startQuiz({
      topics: selectedTopics,
      difficulty,
      questionCount,
      timeLimit
    });
    
    navigate('/interview/quiz');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/interview')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Configure Quiz</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
          <CardDescription>Customize your practice session to focus on specific areas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Topics */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Select Topics</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    selectedTopics.includes(topic)
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {topic}
                  {selectedTopics.includes(topic) && <Check className="inline-block ml-2 h-3 w-3" />}
                </button>
              ))}
            </div>
            {selectedTopics.length === 0 && (
              <p className="text-xs text-red-500">Please select at least one topic.</p>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Difficulty Level</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={cn(
                    "flex-1 py-2 rounded-md text-sm font-medium transition-all border",
                    difficulty === diff
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-700">Number of Questions</label>
              <span className="text-sm font-bold text-blue-600">{questionCount}</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="20" 
              step="1"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>3</span>
              <span>20</span>
            </div>
          </div>

          {/* Time Limit */}
          <div className="space-y-3">
             <label className="text-sm font-medium text-slate-700">Time Limit</label>
             <div className="grid grid-cols-4 gap-2">
               {[0, 5, 10, 15].map(min => (
                 <button
                   key={min}
                   onClick={() => setTimeLimit(min)}
                   className={cn(
                     "py-2 rounded-md text-sm font-medium transition-all border",
                     timeLimit === min
                       ? "bg-slate-100 border-slate-400 text-slate-900"
                       : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                   )}
                 >
                   {min === 0 ? 'No Limit' : `${min} min`}
                 </button>
               ))}
             </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-11 text-base" 
            onClick={handleStart}
            disabled={selectedTopics.length === 0}
          >
            Start Practice Quiz
            <Play className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};