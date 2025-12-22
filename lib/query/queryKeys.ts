export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },

  // Assessments
  assessments: {
    all: ['assessments'] as const,
    lists: () => [...queryKeys.assessments.all, 'list'] as const,
    list: (filters: object) => [...queryKeys.assessments.lists(), filters] as const,
    details: () => [...queryKeys.assessments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.assessments.details(), id] as const,
    session: (sessionId: string) => [...queryKeys.assessments.all, 'session', sessionId] as const,
    results: (sessionId: string) => [...queryKeys.assessments.all, 'results', sessionId] as const,
  },

  // Interviews
  interviews: {
    all: ['interviews'] as const,
    questions: (filters?: object) => [...queryKeys.interviews.all, 'questions', filters] as const,
    quiz: {
      session: (sessionId: string) => [...queryKeys.interviews.all, 'quiz', sessionId] as const,
    },
    text: {
      session: (sessionId: string) => [...queryKeys.interviews.all, 'text', sessionId] as const,
    },
    voice: {
      session: (sessionId: string) => [...queryKeys.interviews.all, 'voice', sessionId] as const,
    },
    bot: {
      session: (sessionId: string) => [...queryKeys.interviews.all, 'bot', sessionId] as const,
    },
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    summary: () => [...queryKeys.analytics.all, 'summary'] as const,
    history: (filters?: object) => [...queryKeys.analytics.all, 'history', filters] as const,
    skills: () => [...queryKeys.analytics.all, 'skills'] as const,
    activity: (days?: number) => [...queryKeys.analytics.all, 'activity', days] as const,
    report: () => [...queryKeys.analytics.all, 'report'] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    datasets: {
      all: () => [...queryKeys.admin.all, 'datasets'] as const,
      list: (filters?: object) => [...queryKeys.admin.datasets.all(), 'list', filters] as const,
      detail: (id: string) => [...queryKeys.admin.all, 'datasets', id] as const,
    },
    questions: {
      all: () => [...queryKeys.admin.all, 'questions'] as const,
      list: (filters?: object) => [...queryKeys.admin.questions.all(), 'list', filters] as const,
      detail: (id: string) => [...queryKeys.admin.all, 'questions', id] as const,
    },
    users: {
      all: () => [...queryKeys.admin.all, 'users'] as const,
      list: (filters?: object) => [...queryKeys.admin.users.all(), 'list', filters] as const,
      detail: (userId: string) => [...queryKeys.admin.all, 'users', userId] as const,
    },
    reports: {
      all: () => [...queryKeys.admin.all, 'reports'] as const,
      detail: (reportId: string) => [...queryKeys.admin.all, 'reports', reportId] as const,
    },
    config: () => [...queryKeys.admin.all, 'config'] as const,
  },
};
