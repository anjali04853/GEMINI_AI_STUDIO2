
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mic, MessageSquare, Clock, ArrowRight, Trophy, PenTool, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useInterviewStore } from '../../store/interviewStore';
import { Badge } from '../../components/ui/Badge';

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Practice Sessions</CardTitle>
            <Trophy className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Average Score</CardTitle>
            <Brain className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Questions Answered</CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Modes */}
      <h2 className="text-xl font-semibold text-slate-900">Practice Modes</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Quiz Mode */}
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Technical Quiz</CardTitle>
            <CardDescription>Timed multiple-choice questions on React, JS, System Design.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/interview/setup">
              <Button className="w-full">Start Quiz</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Text Mode */}
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
              <PenTool className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Behavioral Text</CardTitle>
            <CardDescription>Write responses to behavioral and situational questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/interview/text/setup">
               <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Writing</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Voice Mode */}
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
              <Mic className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle>Voice Recorder</CardTitle>
            <CardDescription>Record answers and analyze clarity and confidence.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/interview/voice/setup">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Start Recorder</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Real-time Bot Mode */}
        <Card className="border-indigo-200 bg-indigo-50/30">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
              <Bot className="h-6 w-6 text-indigo-600" />
            </div>
            <CardTitle>Real-Time Bot</CardTitle>
            <CardDescription>Live conversational interview with Gemini AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/interview/bot/setup">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Start Live</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Recent Quiz History</h2>
        </div>
        
        {recentSessions.length > 0 ? (
          <div className="rounded-md border border-slate-200 bg-white">
            <div className="divide-y divide-slate-100">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                      <Clock className="h-5 w-5 text-slate-500" />
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
                    <Badge variant={session.score >= 80 ? 'success' : session.score >= 50 ? 'warning' : 'destructive'}>
                      {session.score}% Score
                    </Badge>
                    <Link to={`/interview/results?session=${session.id}`}>
                        <ArrowRight className="h-4 w-4 text-slate-400 hover:text-blue-600 cursor-pointer" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-200">
            <p className="text-slate-500">No practice sessions yet. Start a quiz to see your history!</p>
          </div>
        )}
      </div>
    </div>
  );
};
