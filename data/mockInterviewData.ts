import { InterviewQuestion, TextQuestion } from '../types';

export const mockInterviewQuestions: InterviewQuestion[] = [
  // React Questions
  {
    id: 'iq1',
    topic: 'React',
    difficulty: 'Easy',
    text: 'Which hook is used to perform side effects in a functional component?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctOptionIndex: 1,
    explanation: 'useEffect is designed to handle side effects like data fetching, subscriptions, or manually changing the DOM in React functional components.'
  },
  {
    id: 'iq2',
    topic: 'React',
    difficulty: 'Medium',
    text: 'What is the purpose of React.memo?',
    options: [
      'To cache the state of a component',
      'To prevent unnecessary re-renders of functional components',
      'To memorize the return value of a function',
      'To create a reference to a DOM element'
    ],
    correctOptionIndex: 1,
    explanation: 'React.memo is a higher-order component that skips rendering the component if its props have not changed.'
  },
  {
    id: 'iq3',
    topic: 'React',
    difficulty: 'Hard',
    text: 'What happens when you call setState (or the updater from useState) with the same value as the current state?',
    options: [
      'React re-renders the component anyway',
      'React bails out without rendering the children or firing effects',
      'React throws an error',
      'React schedules a background update'
    ],
    correctOptionIndex: 1,
    explanation: 'If you update a State Hook to the same value as the current state, React will bail out without rendering the children or firing effects.'
  },
  
  // JavaScript Questions
  {
    id: 'iq4',
    topic: 'JavaScript',
    difficulty: 'Easy',
    text: 'What is the output of typeof null?',
    options: ['"null"', '"undefined"', '"object"', '"number"'],
    correctOptionIndex: 2,
    explanation: 'In JavaScript, typeof null returns "object". This is a known historical bug in the language implementation.'
  },
  {
    id: 'iq5',
    topic: 'JavaScript',
    difficulty: 'Medium',
    text: 'Which of the following is NOT a way to create a closure?',
    options: [
      'A function inside another function',
      'Passing a function as a callback',
      'Using the "new" keyword',
      'Returning a function from a function'
    ],
    correctOptionIndex: 2,
    explanation: 'Closures are created when functions are defined within other functions, allowing them to access the outer scope. The "new" keyword creates an instance of an object, not a closure itself.'
  },
  
  // CSS Questions
  {
    id: 'iq6',
    topic: 'CSS',
    difficulty: 'Easy',
    text: 'Which CSS property controls the order of items in a flex container?',
    options: ['z-index', 'order', 'flex-direction', 'align-items'],
    correctOptionIndex: 1,
    explanation: 'The order property specifies the order of a flexible item relative to the rest of the flexible items inside the same container.'
  },
  {
    id: 'iq7',
    topic: 'CSS',
    difficulty: 'Medium',
    text: 'What does the "rem" unit stand for?',
    options: [
      'Relative Element Module',
      'Root EM',
      'Real Element Measurement',
      'Recursive EM'
    ],
    correctOptionIndex: 1,
    explanation: 'REM stands for Root EM. It represents the font-size of the root element (<html>).'
  },
  
  // System Design
  {
    id: 'iq8',
    topic: 'System Design',
    difficulty: 'Medium',
    text: 'Which concept refers to adding more power to your existing machine (CPU, RAM) to handle load?',
    options: [
      'Horizontal Scaling',
      'Vertical Scaling',
      'Load Balancing',
      'Sharding'
    ],
    correctOptionIndex: 1,
    explanation: 'Vertical Scaling (scale up) means adding more resources (CPU, RAM, Disk) to your existing server.'
  },
  {
    id: 'iq9',
    topic: 'System Design',
    difficulty: 'Hard',
    text: 'In the CAP theorem, what do C, A, and P stand for?',
    options: [
      'Consistency, Authorization, Persistence',
      'Consistency, Availability, Partition Tolerance',
      'Concurrency, Availability, Performance',
      'Capacity, Availability, Partition Tolerance'
    ],
    correctOptionIndex: 1,
    explanation: 'CAP stands for Consistency (all nodes see same data), Availability (every request gets a response), and Partition Tolerance (system continues to operate despite message loss/failure).'
  }
];

export const mockTextQuestions: TextQuestion[] = [
  {
    id: 'tq1',
    type: 'Behavioral',
    text: 'Tell me about a time you had a conflict with a coworker. How did you resolve it?',
    sampleAnswer: 'I once disagreed with a designer about a UI implementation. I scheduled a quick sync to understand their perspective...'
  },
  {
    id: 'tq2',
    type: 'Behavioral',
    text: 'Describe a situation where you had to meet a tight deadline. How did you prioritize?',
    sampleAnswer: 'During a Q4 release, we were behind schedule. I audited our backlog, identified critical path features...'
  },
  {
    id: 'tq3',
    type: 'Technical',
    text: 'Explain the concept of "Event Loop" in JavaScript to a junior developer.',
    sampleAnswer: 'Imagine a waiter (Event Loop) in a restaurant (JS Runtime). The waiter handles orders (tasks)...'
  },
  {
    id: 'tq4',
    type: 'Situational',
    text: 'You notice a critical security bug in production on a Friday evening. What do you do?',
    sampleAnswer: 'First, I would verify the severity. If critical, I would escalate to the on-call team...'
  },
  {
    id: 'tq5',
    type: 'Technical',
    text: 'What are the pros and cons of Server-Side Rendering (SSR) vs Client-Side Rendering (CSR)?',
  },
  {
    id: 'tq6',
    type: 'Behavioral',
    text: 'Tell me about a time you failed. What did you learn from it?',
  }
];