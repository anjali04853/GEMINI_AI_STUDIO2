import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useTextInterviewStore } from '../../../store/textInterviewStore';
import { TextQuestionType } from '../../../types';
import { cn } from '../../../lib/utils';

const TYPES: TextQuestionType[] = ['Behavioral', 'Technical', 'Situational'];

export const TextSetupPage = () => {
  const navigate = useNavigate();
  const startInterview = useTextInterviewStore(state => state.startInterview);

  const [selectedTypes, setSelectedTypes] = useState<TextQuestionType[]>(['Behavioral']);
  const [questionCount, setQuestionCount] = useState(3);

  const toggleType = (type: TextQuestionType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleStart = () => {
    if (selectedTypes.length === 0) return;
    
    startInterview({
      types: selectedTypes,
      questionCount,
    });
    
    navigate('/interview/text/active');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/interview')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Text Interview Setup</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Settings</CardTitle>
          <CardDescription>Configure your written response practice session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Question Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Question Categories</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    selectedTypes.includes(type)
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {type}
                  {selectedTypes.includes(type) && <Check className="inline-block ml-2 h-3 w-3" />}
                </button>
              ))}
            </div>
            {selectedTypes.length === 0 && (
              <p className="text-xs text-red-500">Please select at least one category.</p>
            )}
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-700">Number of Questions</label>
              <span className="text-sm font-bold text-purple-600">{questionCount}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="1"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>1</span>
              <span>5</span>
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-11 text-base bg-purple-600 hover:bg-purple-700" 
            onClick={handleStart}
            disabled={selectedTypes.length === 0}
          >
            Start Text Interview
            <Play className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};