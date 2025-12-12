import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';

const TOUR_STEPS = [
  {
    title: "Welcome to SkillForge",
    description: "Your all-in-one platform for AI-powered skill assessment and interview preparation.",
  },
  {
    title: "Assessments",
    description: "Navigate to Assessments to take technical and behavioral quizzes to validate your skills.",
  },
  {
    title: "Interview Prep",
    description: "Practice with text, voice, and real-time AI interview bots in the Interview section.",
  },
  {
    title: "Analytics",
    description: "Track your progress, view detailed history, and identify areas for improvement.",
  }
];

export const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour');
    if (!hasSeenTour) {
      // Small delay to allow initial render
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenOnboardingTour', 'true');
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-md shadow-2xl relative">
        <button 
          onClick={handleComplete}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close tour"
        >
          <X className="h-4 w-4" />
        </button>
        <CardHeader>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                </span>
            </div>
            <CardTitle>{step.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-slate-600">{step.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={handleComplete}>Skip Tour</Button>
            <Button onClick={handleNext}>
                {currentStep === TOUR_STEPS.length - 1 ? (
                    <>Get Started <Check className="ml-2 h-4 w-4" /></>
                ) : (
                    <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
                )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};