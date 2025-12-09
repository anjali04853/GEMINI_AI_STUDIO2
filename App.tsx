
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { Dashboard } from './pages/Dashboard';
import { AIChatPage } from './pages/AIChatPage';
import { AssessmentListPage } from './pages/assessments/AssessmentListPage';
import { AssessmentPlayerPage } from './pages/assessments/AssessmentPlayerPage';
import { AssessmentResultsPage } from './pages/assessments/AssessmentResultsPage';
import { InterviewDashboard } from './pages/interview/InterviewDashboard';
import { QuizSetupPage } from './pages/interview/QuizSetupPage';
import { QuizPlayerPage } from './pages/interview/QuizPlayerPage';
import { QuizResultsPage } from './pages/interview/QuizResultsPage';
import { TextSetupPage } from './pages/interview/text/TextSetupPage';
import { TextPlayerPage } from './pages/interview/text/TextPlayerPage';
import { TextResultsPage } from './pages/interview/text/TextResultsPage';
import { VoiceSetupPage } from './pages/interview/voice/VoiceSetupPage';
import { VoicePlayerPage } from './pages/interview/voice/VoicePlayerPage';
import { VoiceResultsPage } from './pages/interview/voice/VoiceResultsPage';
import { BotSetupPage } from './pages/interview/bot/BotSetupPage';
import { BotInterviewPage } from './pages/interview/bot/BotInterviewPage';
import { BotResultsPage } from './pages/interview/bot/BotResultsPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          
          {/* Assessment Routes */}
          <Route path="assessments" element={<AssessmentListPage />} />
          <Route path="assessments/:id" element={<AssessmentPlayerPage />} />
          <Route path="assessments/:id/results" element={<AssessmentResultsPage />} />
          
          {/* Interview Prep Routes */}
          <Route path="interview" element={<InterviewDashboard />} />
          
          {/* Quiz Mode */}
          <Route path="interview/setup" element={<QuizSetupPage />} />
          <Route path="interview/quiz" element={<QuizPlayerPage />} />
          <Route path="interview/results" element={<QuizResultsPage />} />
          
          {/* Text Mode */}
          <Route path="interview/text/setup" element={<TextSetupPage />} />
          <Route path="interview/text/active" element={<TextPlayerPage />} />
          <Route path="interview/text/results" element={<TextResultsPage />} />
          
          {/* Voice Mode */}
          <Route path="interview/voice/setup" element={<VoiceSetupPage />} />
          <Route path="interview/voice/active" element={<VoicePlayerPage />} />
          <Route path="interview/voice/results" element={<VoiceResultsPage />} />

          {/* Bot Mode */}
          <Route path="interview/bot/setup" element={<BotSetupPage />} />
          <Route path="interview/bot/active" element={<BotInterviewPage />} />
          <Route path="interview/bot/results" element={<BotResultsPage />} />
          
          {/* Utilities */}
          <Route path="chat" element={<AIChatPage />} />
          <Route path="profile" element={<div className="p-4">Profile Page Placeholder</div>} />
          <Route path="settings" element={<div className="p-4">Settings Page Placeholder</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
