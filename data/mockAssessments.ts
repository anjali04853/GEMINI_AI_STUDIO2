
import { Assessment } from '../types';

export const mockAssessments: Assessment[] = [
  {
    id: '1',
    title: 'Frontend Development Fundamentals',
    description: 'Evaluate your knowledge of React, TypeScript, and modern CSS practices.',
    durationMinutes: 15,
    category: 'Technical',
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'What is the primary purpose of useEffect in React?',
        required: true,
        options: [
          'To manage global state',
          'To perform side effects in functional components',
          'To create memoized values',
          'To handle routing'
        ]
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        text: 'Which CSS utility class in Tailwind sets the background color to blue-500?',
        required: true,
        options: ['color-blue-500', 'bg-blue-500', 'text-blue-500', 'background-blue-500']
      },
      {
        id: 'q3',
        type: 'text',
        text: 'Briefly explain the difference between interface and type in TypeScript.',
        required: true,
      },
      {
        id: 'q4',
        type: 'rating',
        text: 'How confident are you in writing unit tests with Jest?',
        required: true,
      },
      {
        id: 'q5',
        type: 'ranking',
        text: 'Order the following React lifecycle phases from first to last.',
        required: true,
        options: [
            'Mounting',
            'Updating',
            'Unmounting',
            'Error Handling'
        ]
      },
      {
        id: 'q6',
        type: 'select',
        text: 'Select your preferred state management library.',
        required: true,
        options: ['Redux', 'Zustand', 'Context API', 'Recoil', 'MobX']
      }
    ]
  },
  {
    id: '2',
    title: 'Communication & Leadership',
    description: 'Assess your soft skills, leadership style, and conflict resolution abilities.',
    durationMinutes: 10,
    category: 'Soft Skills',
    difficulty: 'Beginner',
    questions: [
      {
        id: 'sq1',
        type: 'multiple-choice',
        text: 'A team member is consistently missing deadlines. What is your first step?',
        required: true,
        options: [
          'Report them to management',
          'Ignore it to avoid conflict',
          'Have a private 1:1 conversation to understand the root cause',
          'Do their work for them'
        ]
      },
      {
        id: 'sq2',
        type: 'rating',
        text: 'Rate your ability to explain complex technical concepts to non-technical stakeholders.',
        required: true,
      },
      {
        id: 'sq3',
        type: 'text',
        text: 'Describe a situation where you had to disagree with a decision made by your supervisor.',
        required: true,
      }
    ]
  }
];
