
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  joinedAt?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// Assessment Types
export type QuestionType = 'multiple-choice' | 'text' | 'rating';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string | number; // For scoring (optional)
  required?: boolean;
  category?: string; // Added for admin filtering
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: Question[];
}

export interface UserResponse {
  questionId: string;
  answer: string | number;
}

export interface AssessmentResult {
  assessmentId: string;
  responses: UserResponse[];
  score?: number;
  completedAt: number;
  aiAnalysis?: string;
}

// Interview Quiz Types
export type InterviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface InterviewQuestion {
  id: string;
  topic: string;
  difficulty: InterviewDifficulty;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizConfig {
  topics: string[];
  difficulty: InterviewDifficulty;
  questionCount: number;
  timeLimit: number; // in minutes, 0 for unlimited
}

export interface InterviewSession {
  id: string;
  date: number;
  config: QuizConfig;
  score: number;
  totalQuestions: number;
  correctCount: number;
  durationSeconds: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
}

// Interview Text Mode Types
export type TextQuestionType = 'Behavioral' | 'Technical' | 'Situational';
export type ExperienceLevel = 'Entry' | 'Mid' | 'Senior';

export interface TextQuestion {
  id: string;
  type: TextQuestionType;
  text: string;
  sampleAnswer?: string;
}

export interface TextInterviewConfig {
  types: TextQuestionType[];
  questionCount: number;
  experienceLevel: ExperienceLevel;
  customTopics: string[];
}

export interface TextInterviewSession {
  id: string;
  date: number;
  config: TextInterviewConfig;
  questions: TextQuestion[];
  answers: Record<string, string>; // questionId -> text answer
  feedback?: Record<string, string>; // questionId -> AI feedback analysis
}

// Interview Voice Mode Types
export interface VoiceInterviewConfig {
  questionCount: number;
}

export interface VoiceAnswer {
  audioUrl: string; // Blob URL
  transcript: string;
  durationSeconds: number;
}

export interface VoiceInterviewSession {
  id: string;
  date: number;
  questions: TextQuestion[]; // Reusing TextQuestion as they are similar structure
  answers: Record<string, VoiceAnswer>;
  feedback?: Record<string, string>; // AI Analysis
}

// Interview Bot Mode Types
export interface VoiceBotConfig {
  topic: string;
  context: string;
  difficulty: string;
}

export interface BotTranscriptItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface VoiceBotSession {
  id: string;
  date: number;
  config: VoiceBotConfig;
  transcript: BotTranscriptItem[];
  durationSeconds: number;
}

// --- Admin Types ---

export interface Dataset {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  isActive: boolean;
  lastUpdated: number;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  aiModelVersion: string;
  defaultTimeLimit: number;
  maxDailySessions: number;
}

export interface ReportItem {
  id: string;
  type: 'response' | 'question' | 'user';
  contentId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: number;
}
