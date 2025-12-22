import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/query/queryClient';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { Loading, FullPageLoading } from './components/Loading';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OnboardingTour } from './components/OnboardingTour';
import { ThemeProvider } from './components/ThemeProvider';

// Lazy Load Pages
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const AIChatPage = React.lazy(() => import('./pages/AIChatPage').then(module => ({ default: module.AIChatPage })));
const LiveKitVoicePage = React.lazy(() => import('./pages/LiveKitVoicePage').then(module => ({ default: module.LiveKitVoicePage })));
const AssessmentListPage = React.lazy(() => import('./pages/assessments/AssessmentListPage').then(module => ({ default: module.AssessmentListPage })));
const AssessmentPlayerPage = React.lazy(() => import('./pages/assessments/AssessmentPlayerPage').then(module => ({ default: module.AssessmentPlayerPage })));
const AssessmentResultsPage = React.lazy(() => import('./pages/assessments/AssessmentResultsPage').then(module => ({ default: module.AssessmentResultsPage })));
const InterviewDashboard = React.lazy(() => import('./pages/interview/InterviewDashboard').then(module => ({ default: module.InterviewDashboard })));
const QuizSetupPage = React.lazy(() => import('./pages/interview/QuizSetupPage').then(module => ({ default: module.QuizSetupPage })));
const QuizPlayerPage = React.lazy(() => import('./pages/interview/QuizPlayerPage').then(module => ({ default: module.QuizPlayerPage })));
const QuizResultsPage = React.lazy(() => import('./pages/interview/QuizResultsPage').then(module => ({ default: module.QuizResultsPage })));
const TextSetupPage = React.lazy(() => import('./pages/interview/text/TextSetupPage').then(module => ({ default: module.TextSetupPage })));
const TextPlayerPage = React.lazy(() => import('./pages/interview/text/TextPlayerPage').then(module => ({ default: module.TextPlayerPage })));
const TextResultsPage = React.lazy(() => import('./pages/interview/text/TextResultsPage').then(module => ({ default: module.TextResultsPage })));
const VoiceSetupPage = React.lazy(() => import('./pages/interview/voice/VoiceSetupPage').then(module => ({ default: module.VoiceSetupPage })));
const VoicePlayerPage = React.lazy(() => import('./pages/interview/voice/VoicePlayerPage').then(module => ({ default: module.VoicePlayerPage })));
const VoiceResultsPage = React.lazy(() => import('./pages/interview/voice/VoiceResultsPage').then(module => ({ default: module.VoiceResultsPage })));
const BotSetupPage = React.lazy(() => import('./pages/interview/bot/BotSetupPage').then(module => ({ default: module.BotSetupPage })));
const BotInterviewPage = React.lazy(() => import('./pages/interview/bot/BotInterviewPage').then(module => ({ default: module.BotInterviewPage })));
const BotResultsPage = React.lazy(() => import('./pages/interview/bot/BotResultsPage').then(module => ({ default: module.BotResultsPage })));
const AnalyticsDashboard = React.lazy(() => import('./pages/analytics/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));
const HistoryPage = React.lazy(() => import('./pages/analytics/HistoryPage').then(module => ({ default: module.HistoryPage })));
const ProgressReportPage = React.lazy(() => import('./pages/analytics/ProgressReportPage').then(module => ({ default: module.ProgressReportPage })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const QuestionManagement = React.lazy(() => import('./pages/admin/QuestionManagement').then(module => ({ default: module.QuestionManagement })));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement').then(module => ({ default: module.UserManagement })));
const DatasetManagement = React.lazy(() => import('./pages/admin/DatasetManagement').then(module => ({ default: module.DatasetManagement })));
const SystemSettings = React.lazy(() => import('./pages/admin/SystemSettings').then(module => ({ default: module.SystemSettings })));
const ProfilePage = React.lazy(() => import('./pages/profile/ProfilePage').then(module => ({ default: module.ProfilePage })));
const AdminProfilePage = React.lazy(() => import('./pages/admin/AdminProfilePage').then(module => ({ default: module.AdminProfilePage })));
const SettingsPage = React.lazy(() => import('./pages/settings/SettingsPage').then(module => ({ default: module.SettingsPage })));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage').then(module => ({ default: module.AdminSettingsPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const AccessDeniedPage = React.lazy(() => import('./pages/AccessDeniedPage').then(module => ({ default: module.AccessDeniedPage })));

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }: { children?: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, _hasHydrated } = useAuthStore();
  
  // Wait for hydration before making routing decisions
  if (!_hasHydrated) {
    return <Loading />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/access-denied" replace />;
  }
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, _hasHydrated } = useAuthStore();
  
  // Debug log
  console.log('PublicRoute - hasHydrated:', _hasHydrated, 'user:', user);
  
  // Wait for hydration before making routing decisions
  if (!_hasHydrated) {
    return <Loading />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <Suspense fallback={<FullPageLoading />}>
              <BrowserRouter>
                <OfflineIndicator />
                <OnboardingTour />
                <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><Suspense fallback={<Loading />}><LandingPage /></Suspense></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
            <Route path="/access-denied" element={<Suspense fallback={<Loading />}><AccessDeniedPage /></Suspense>} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
              
              {/* Assessment Routes */}
              <Route path="assessments" element={<Suspense fallback={<Loading />}><AssessmentListPage /></Suspense>} />
              <Route path="assessments/:id" element={<Suspense fallback={<Loading />}><AssessmentPlayerPage /></Suspense>} />
              <Route path="assessments/:id/results" element={<Suspense fallback={<Loading />}><AssessmentResultsPage /></Suspense>} />
              
              {/* Interview Prep Routes */}
              <Route path="interview" element={<Suspense fallback={<Loading />}><InterviewDashboard /></Suspense>} />
              
              {/* Quiz Mode */}
              <Route path="interview/setup" element={<Suspense fallback={<Loading />}><QuizSetupPage /></Suspense>} />
              <Route path="interview/quiz" element={<Suspense fallback={<Loading />}><QuizPlayerPage /></Suspense>} />
              <Route path="interview/results" element={<Suspense fallback={<Loading />}><QuizResultsPage /></Suspense>} />
              
              {/* Text Mode */}
              <Route path="interview/text/setup" element={<Suspense fallback={<Loading />}><TextSetupPage /></Suspense>} />
              <Route path="interview/text/active" element={<Suspense fallback={<Loading />}><TextPlayerPage /></Suspense>} />
              <Route path="interview/text/results" element={<Suspense fallback={<Loading />}><TextResultsPage /></Suspense>} />
              
              {/* Voice Mode */}
              <Route path="interview/voice/setup" element={<Suspense fallback={<Loading />}><VoiceSetupPage /></Suspense>} />
              <Route path="interview/voice/active" element={<Suspense fallback={<Loading />}><VoicePlayerPage /></Suspense>} />
              <Route path="interview/voice/results" element={<Suspense fallback={<Loading />}><VoiceResultsPage /></Suspense>} />

              {/* Bot Mode */}
              <Route path="interview/bot/setup" element={<Suspense fallback={<Loading />}><BotSetupPage /></Suspense>} />
              <Route path="interview/bot/active" element={<Suspense fallback={<Loading />}><BotInterviewPage /></Suspense>} />
              <Route path="interview/bot/results" element={<Suspense fallback={<Loading />}><BotResultsPage /></Suspense>} />
              
              {/* Analytics Routes */}
              <Route path="analytics" element={<Suspense fallback={<Loading />}><AnalyticsDashboard /></Suspense>} />
              <Route path="analytics/history" element={<Suspense fallback={<Loading />}><HistoryPage /></Suspense>} />
              <Route path="analytics/report" element={<Suspense fallback={<Loading />}><ProgressReportPage /></Suspense>} />

              {/* Admin Routes */}
              <Route path="admin" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><AdminDashboard /></Suspense></ProtectedRoute>} />
              <Route path="admin/questions" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><QuestionManagement /></Suspense></ProtectedRoute>} />
              <Route path="admin/users" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><UserManagement /></Suspense></ProtectedRoute>} />
              <Route path="admin/datasets" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><DatasetManagement /></Suspense></ProtectedRoute>} />
              <Route path="admin/settings" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><SystemSettings /></Suspense></ProtectedRoute>} />

              {/* Utilities */}
              <Route path="chat" element={<Suspense fallback={<Loading />}><AIChatPage /></Suspense>} />
              <Route path="voice-live" element={<Suspense fallback={<Loading />}><LiveKitVoicePage /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<Loading />}><ProfilePage /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<Loading />}><SettingsPage /></Suspense>} />
              
              {/* Admin Profile & Settings */}
              <Route path="admin/profile" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><AdminProfilePage /></Suspense></ProtectedRoute>} />
              <Route path="admin/account" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<Loading />}><AdminSettingsPage /></Suspense></ProtectedRoute>} />

              {/* Protected 404 */}
              <Route path="*" element={<Suspense fallback={<Loading />}><NotFoundPage /></Suspense>} />
            </Route>

                  {/* Fallback for unauthenticated strict 404s outside dashboard */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </BrowserRouter>
            </Suspense>
          </ToastProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;