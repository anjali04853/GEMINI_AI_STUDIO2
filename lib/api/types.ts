// ===== Auth Types =====
export interface LoginRequest {
  email: string;
  password: string;
  organizationName: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
  organizationName: string;
}

export interface AuthUser {
  id: string | number;
  email: string;
  name: string | null;
  role?: 'user' | 'admin' | 'member';
  organizationId?: number;
  organizations?: Array<{
    id: number;
    name: string;
    role: string;
  }>;
}

export interface Organization {
  id: number | string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
  organization?: Organization;
}

export interface ProfileUpdateRequest {
  email?: string;
  name?: string;
}

export interface SwitchOrganizationRequest {
  organizationId: number;
}

export interface SwitchOrganizationResponse {
  success: boolean;
  token: string;
  organizationId: number;
}

// ===== Assessment Types =====
export interface AssessmentListFilters {
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface AssessmentListItem {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentListResponse {
  assessments: AssessmentListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'ranking' | 'select';
  options?: string[];
}

export interface StartAssessmentResponse {
  sessionId: string;
  questions: AssessmentQuestion[];
  durationMinutes: number;
  startedAt: string;
}

export interface SubmitAssessmentRequest {
  answers: Record<string, string | number | string[]>;
  durationSeconds?: number;
}

export interface AssessmentResultResponse {
  sessionId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
  feedback?: Array<{
    questionId: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
}

export interface CreateAssessmentRequest {
  title: string;
  description?: string;
  durationMinutes: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionIds?: number[];
  questionConfig?: {
    topics?: string[];
    count?: number;
    randomize?: boolean;
  };
  isPublished?: boolean;
}

// ===== Interview Types =====
export interface StartQuizRequest {
  topics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  timeLimit: number; // 0 = unlimited
}

export interface StartInterviewRequest {
  questionCount?: number;
  difficulty?: string;
  types?: string[];
  topic?: string;
  context?: string;
  timeLimit?: number;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  type?: string;
  options?: string[];
}

export interface StartInterviewResponse {
  sessionId: string;
  questions: InterviewQuestion[];
  startedAt: string;
  durationMinutes?: number;
  config?: Record<string, unknown>;
  systemPrompt?: string;
}

export interface SubmitQuizRequest {
  answers: Record<string, number>;
  durationSeconds?: number;
}

export interface QuizResultResponse {
  sessionId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
}

export interface TextAnswerRequest {
  questionId: string;
  answer: string;
}

export interface BotMessageRequest {
  message: string;
}

export interface BotMessageResponse {
  response: string;
  sessionId: string;
}

export interface SaveBotInterviewRequest {
  durationSeconds?: number;
}

export interface InterviewResultResponse {
  sessionId: string;
  score?: number;
  feedback?: string | Record<string, unknown>;
  completedAt: string;
}

// ===== Analytics Types =====
export interface AnalyticsSummary {
  totalActivities: number;
  averageScore: number;
  totalHours: string;
  sessionsThisWeek: number;
  streakDays: number;
  lastActivityAt: string | null;
}

export interface ActivityHistoryFilters {
  type?: 'assessment' | 'interview';
  limit?: number;
  offset?: number;
}

export interface ActivityHistoryItem {
  sessionId: string;
  type: string;
  mode?: string;
  score?: number;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
}

export interface ActivityHistoryResponse {
  sessions: ActivityHistoryItem[];
  total: number;
}

export interface SkillProficiency {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  proficiency: number;
  assessments: number;
  lastAssessment?: string;
}

export interface SkillsResponse {
  skills: SkillProficiency[];
}

export interface ActivityTimelineItem {
  date: string;
  count: number;
  type: string;
}

export interface ActivityTimelineResponse {
  activities: ActivityTimelineItem[];
}

export interface AnalyticsReportResponse {
  period: string;
  totalSessions: number;
  averageScore: number;
  improvementRate: number;
  topSkills: string[];
  weakSkills: string[];
  recommendations: string[];
}

// ===== Admin Types =====
export interface DatasetFilters {
  type?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  questionCount: number;
  isActive: boolean;
  lastUpdated: string;
  createdAt: string;
}

export interface DatasetListResponse {
  datasets: Dataset[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateDatasetRequest {
  name: string;
  description?: string;
  type: string;
  category: string;
  questionIds?: number[];
}

export interface AdminQuestionFilters {
  category?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface AdminQuestion {
  id: string;
  text: string;
  type: string;
  category: string;
  difficulty: string;
  options?: string[];
  correctAnswer?: string | number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminQuestionListResponse {
  questions: AdminQuestion[];
  total: number;
}

export interface CreateQuestionRequest {
  text: string;
  type: string;
  category: string;
  difficulty: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  totalActivities: number;
  averageScore: number;
  lastActive: string;
  createdAt: string;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total: number;
}

export interface AdminUserFilters {
  limit?: number;
  offset?: number;
}

export interface AdminReportItem {
  id: string;
  userId: string;
  userName: string;
  totalSessions: number;
  averageScore: number;
  createdAt: string;
}

export interface AdminReportListResponse {
  reports: AdminReportItem[];
  total: number;
}

export interface AdminReportDetail {
  userId: string;
  userName: string;
  period: string;
  totalSessions: number;
  sessionBreakdown: {
    assessments: number;
    interviews: number;
    quizzes: number;
  };
  averageScore: number;
  skillsProgress: Array<{
    skill: string;
    improvement: number;
  }>;
}

export interface SystemConfig {
  maxQuestionsPerSession: number;
  assessmentDurationMinutes: number;
  interviewDurationMinutes: number;
  scoringAlgorithm: string;
  features: {
    voiceInterview: boolean;
    botInterview: boolean;
    textInterview: boolean;
    analytics: boolean;
  };
}

// ===== Interview Questions Types =====
export interface InterviewQuestionFilters {
  category?: string;
  type?: 'behavioral' | 'situational' | 'technical';
  difficulty?: string;
  limit?: number;
  offset?: number;
}

export interface InterviewQuestionItem {
  id: string;
  text: string;
  type: 'behavioral' | 'situational' | 'technical';
  category: string;
  difficulty: string;
  hints?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface InterviewQuestionListResponse {
  questions: InterviewQuestionItem[];
  total: number;
}

export interface CreateInterviewQuestionRequest {
  text: string;
  type: 'behavioral' | 'situational' | 'technical';
  category: string;
  difficulty: string;
  hints?: string[];
  expectedAnswerKeywords?: string[];
}

// ===== File Upload Types =====
export interface UploadUrlRequest {
  sessionId: string;
  questionId: string;
  contentType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

export interface TranscribeRequest {
  key: string;
  sessionId: string;
}

export interface TranscribeResponse {
  transcription: string;
  duration: number;
}

export interface PlaybackUrlRequest {
  key: string;
}

export interface PlaybackUrlResponse {
  playbackUrl: string;
  expiresIn: number;
}
