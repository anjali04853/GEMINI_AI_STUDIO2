import React, { useState } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Download, RefreshCw, Bot, ChevronRight } from 'lucide-react';
import { useAssessmentStore } from '../../store/assessmentStore';
import { mockAssessments } from '../../data/mockAssessments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { generateResponse } from '../../services/geminiService';

export const AssessmentResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { responses, isFinished } = useAssessmentStore();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Find assessment (in a real app, we'd fetch the specific result)
  const assessment = mockAssessments.find(a => a.id === id);

  if (!assessment) return <Navigate to="/assessments" replace />;
  // Simple check to ensure we actually took it (in local dev, reloading loses store state)
  const hasResponses = Object.keys(responses).length > 0;
  
  // Calculate mock score for demo purposes
  const score = hasResponses ? 85 : 0; 
  const totalQuestions = assessment.questions.length;
  const correctAnswers = Math.round(totalQuestions * (score / 100));

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Construct a prompt for Gemini
      const prompt = `
        I just completed a skills assessment titled "${assessment.title}".
        Here are the questions and my answers (simplified):
        ${assessment.questions.map(q => `- Q: ${q.text} \n  Answer: ${responses[q.id] || 'Skipped'}`).join('\n')}
        
        Please provide a concise analysis of my skills, identify 2 strengths, 2 weaknesses, and suggest 3 concrete learning resources or next steps.
        Format with clear headings.
      `;
      
      const result = await generateResponse(prompt);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysis("Sorry, I couldn't generate the analysis at this time. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Assessment Completed!</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          You have successfully completed the <span className="font-semibold">{assessment.title}</span> assessment.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Score Card */}
        <Card className="md:col-span-1 border-t-4 border-t-blue-600">
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Based on your responses</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">{score}%</div>
            <p className="text-sm text-slate-500">
              {correctAnswers} out of {totalQuestions} questions correct (estimated)
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Proficiency Level</span>
                <span className="font-medium text-green-600">Advanced</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Percentile</span>
                <span className="font-medium">Top 15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Section */}
        <Card className="md:col-span-2 border-t-4 border-t-purple-600 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  AI Performance Analysis
                </CardTitle>
                <CardDescription>Get personalized feedback powered by Gemini</CardDescription>
              </div>
              {!analysis && (
                <Button 
                  onClick={handleAIAnalysis} 
                  isLoading={isAnalyzing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Generate Report
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {isAnalyzing ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-500 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p>Analyzing your answers...</p>
              </div>
            ) : analysis ? (
              <div className="prose prose-sm prose-slate max-w-none bg-slate-50 p-4 rounded-lg border border-slate-100 overflow-y-auto max-h-[400px]">
                {/* Simple rendering of the markdown/text response */}
                <div className="whitespace-pre-wrap">{analysis}</div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200 p-8">
                <Bot className="h-12 w-12 mb-3 opacity-20" />
                <p>Click "Generate Report" to receive detailed feedback on your strengths and areas for improvement.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <Link to="/assessments">
          <Button variant="outline">
            <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Assessments
          </Button>
        </Link>
        <Button variant="secondary">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Link to={`/assessments/${id}`}>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retake Assessment
          </Button>
        </Link>
      </div>
    </div>
  );
};