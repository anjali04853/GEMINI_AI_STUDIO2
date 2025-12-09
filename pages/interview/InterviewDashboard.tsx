
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mic, MessageSquare, Clock, ArrowRight, Trophy, PenTool, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useInterviewStore } from '../../store/interviewStore';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';

export const InterviewDashboard = () => {
  const { sessions } = useInterviewStore();
  const recentSessions = sessions.slice(0, 3);

  const stats = {
    totalSessions: sessions.length,
    avgScore: sessions.length > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length) 
      : 0,
    totalQuestions: sessions.reduce((acc, s) => acc + s.totalQuestions, 0)
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interview Preparation</h1>
        <p className="text-slate-500 mt-2">Master technical questions, practice behavioral responses, and get AI feedback.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-t-4 border-brand-purple shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Practice Sessions</CardTitle>
            <Trophy className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalSessions}</div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-brand-turquoise shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Average Score</CardTitle>
            <Brain className="h-4 w-4 text-brand-turquoise" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.avgScore}%</div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-brand-pink shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Questions Answered</CardTitle>
            <MessageSquare className="h-4 w-4 text-brand-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalQuestions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Modes */}
      <h2 className="text-xl font-semibold text-slate-900">Select Practice Mode</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Quiz Mode - Royal Purple Theme */}
        <Link to="/interview/setup" className="group block">
          <Card className="h-full border-2 border-slate-100 hover:border-brand-purple transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-brand-lavender flex items-center justify-center mb-4 group-hover:bg-brand-purple transition-colors">
                <Brain className="h-6 w-6 text-brand-purple group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="group-hover:text-brand-purple transition-colors">Technical Quiz</CardTitle>
              <CardDescription>Timed multiple-choice questions on React, JS, System Design.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-white text-brand-purple border-2 border-brand-purple hover:bg-brand-purple hover:text-white transition-all">Start Quiz</Button>
            </CardContent>
          </Card>
        </Link>

        {/* Text Mode - Coral Pink Theme */}
        <Link to="/interview/text/setup" className="group block">
          <Card className="h-full border-2 border-slate-100 hover:border-brand-pink transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4 group-hover:bg-brand-pink transition-colors">
                <PenTool className="h-6 w-6 text-brand-pink group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="group-hover:text-brand-pink transition-colors">Behavioral Text</CardTitle>
              <CardDescription>Write responses to behavioral and situational questions.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button className="w-full bg-white text-brand-pink border-2 border-brand-pink hover:bg-brand-pink hover:text-white transition-all">Start Writing</Button>
            </CardContent>
          </Card>
        </Link>

        {/* Voice Mode - Turquoise Theme */}
        <Link to="/interview/voice/setup" className="group block">
          <Card className="h-full border-2 border-slate-100 hover:border-brand-turquoise transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-brand-turquoise transition-colors">
                <Mic className="h-6 w-6 text-brand-turquoise group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="group-hover:text-brand-turquoise transition-colors">Voice Recorder</CardTitle>
              <CardDescription>Record answers and analyze clarity and confidence.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full bg-white text-brand-turquoise border-2 border-brand-turquoise hover:bg-brand-turquoise hover:text-white transition-all">Start Recorder</Button>
            </CardContent>
          </Card>
        </Link>

        {/* Bot Mode - Sky Blue Theme */}
        <Link to="/interview/bot/setup" className="group block">
          <Card className="h-full border-2 border-slate-100 hover:border-brand-sky transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mb-4 group-hover:bg-brand-sky transition-colors">
                <Bot className="h-6 w-6 text-brand-sky group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="group-hover:text-brand-sky transition-colors">Real-Time Bot</CardTitle>
              <CardDescription>Live conversational interview with Gemini AI.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full bg-white text-brand-sky border-2 border-brand-sky hover:bg-brand-sky hover:text-white transition-all">Start Live</Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Recent Quiz History</h2>
        </div>
        
        {recentSessions.length > 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-lavender">
                      <Clock className="h-5 w-5 text-brand-purple" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Technical Quiz • {session.totalQuestions} Questions
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        session.score >= 80 ? "bg-green-100 text-green-800" : session.score >= 50 ? "bg-brand-yellow/30 text-yellow-800" : "bg-red-100 text-red-800"
                    )}>
                      {session.score}% Score
                    </span>
                    <Link to={`/interview/results?session=${session.id}`}>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-brand-purple">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500">No practice sessions yet. Start a quiz to see your history!</p>
          </div>
        )}
      </div>
    </div>
  );
};
